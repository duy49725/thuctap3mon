import { AppDataSource } from "@database/data-source";
import { Product } from "@models/products";
import { Promotion } from "@models/promotions";
import { Request, Response } from "express";
import { In, Repository } from "typeorm";

class ProductController {
    productRepository: Repository<Product>;
    promotionRepository: Repository<Promotion>;

    constructor() {
        this.productRepository = AppDataSource.getRepository(Product);
        this.promotionRepository = AppDataSource.getRepository(Promotion);
    }

    async getAllProduct(req: Request, res: Response): Promise<void> {
        try {
            const { search, category, fruitType, minPrice, maxPrice, sort, page = 1, limit = 10000 } = req.query;
            console.log(req.query);

            const totalProduct = await this.productRepository.count();

            let query = this.productRepository.createQueryBuilder("product")
                .leftJoinAndSelect("product.categories", "category")
                .leftJoinAndSelect("product.promotions", "promotion")
                .leftJoinAndSelect("product.fruitType", "fruitType")
                .where("product.isActive = :isActive", { isActive: true });

            if (search) {
                query.andWhere("product.name LIKE :search", { search: `%${search}%` });
            }

            if (category) {
                const categoryIds = (category as string).split(",").map(Number);
                if (categoryIds.length > 0) {
                    query.andWhere("category.id IN (:...categoryIds)", { categoryIds });
                }
            }

            if (fruitType) {
                const fruitTypeIds = (fruitType as string).split(",").map(Number);
                if (fruitTypeIds.length > 0) {
                    query.andWhere("fruitType.id IN (:...fruitTypeIds)", { fruitTypeIds });
                }
            }

            if (minPrice !== undefined || maxPrice !== undefined) {
                query.andWhere((qb) => {
                    const subQuery = qb.subQuery()
                        .select("p.id")
                        .from("product", "p")
                        .leftJoin("p.promotions", "promo")
                        .where("p.id = product.id")
                        .andWhere("promo.isActive = :isActive", { isActive: true })
                        .select(`
                            MIN(
                                CASE 
                                    WHEN promo.discountType = 'percentage' THEN p.price * (1 - promo.discountAmount / 100)
                                    WHEN promo.discountType = 'fixed' THEN p.price - promo.discountAmount
                                    ELSE p.price
                                END
                            )
                        `, "bestPrice");

                    let conditions = [];
                    if (minPrice !== undefined) {
                        conditions.push(`${subQuery.getQuery()} >= :minPrice`);
                    }
                    if (maxPrice !== undefined) {
                        conditions.push(`${subQuery.getQuery()} <= :maxPrice`);
                    }
                    return conditions.join(" AND ");
                }, { minPrice, maxPrice });
            }

            if (sort) {
                if (sort === "price_asc") {
                    query.orderBy(`
                        (SELECT MIN(
                            CASE 
                                WHEN promo.discountType = 'percentage' THEN product.price * (1 - promo.discountAmount / 100)
                                WHEN promo.discountType = 'fixed' THEN product.price - promo.discountAmount
                                ELSE product.price
                            END
                        ) FROM promotion promo WHERE promo.productId = product.id AND promo.isActive = true)
                    `, "ASC").addOrderBy("product.id", "ASC");
                } else if (sort === "price_desc") {
                    query.orderBy(`
                        (SELECT MIN(
                            CASE 
                                WHEN promo.discountType = 'percentage' THEN product.price * (1 - promo.discountAmount / 100)
                                WHEN promo.discountType = 'fixed' THEN product.price - promo.discountAmount
                                ELSE product.price
                            END
                        ) FROM promotion promo WHERE promo.productId = product.id AND promo.isActive = true)
                    `, "DESC").addOrderBy("product.id", "DESC");
                } else if (sort === "quantity") {
                    query.orderBy("product.quantity", "DESC");
                } else if (sort === "newest") {
                    query.orderBy("product.createdAt", "DESC");
                }
            }

            const offset = (Number(page) - 1) * Number(limit);
            query.skip(offset).take(Number(limit));

            const products = await query.getMany();
            res.status(200).json({
                success: true,
                data: products,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    totalProduct: totalProduct
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    async getPromotionsWithProduct(req: Request, res: Response): Promise<void> {
        try {
            // Lấy tất cả promotion active và sản phẩm liên quan
            const promotions = await this.promotionRepository.createQueryBuilder("promotion")
                .leftJoinAndSelect("promotion.products", "products")
                .leftJoinAndSelect("products.fruitType", "fruitType")
                .leftJoinAndSelect("products.categories", "categories")
                .leftJoinAndSelect("products.productImages", "productImages")
                .leftJoinAndSelect("products.promotions", "productPromotions")
                .where("promotion.isActive = :isActive", { isActive: true })
                .andWhere("products.isActive = :isActive", { isActive: true })
                .getMany();

            if (!promotions.length) {
                res.status(404).json({
                    message: "No active promotions found"
                });
                return;
            }

            // Hàm tính giá tốt nhất cho sản phẩm dựa trên promotion active và ngày
            const getBestPromotion = (product: Product) => {
                if (!product.promotions || product.promotions.length === 0) {
                    return null;
                }

                const now = new Date(); // Ngày hiện tại

                return product.promotions
                    .filter(promo => {
                        const startDate = new Date(promo.startDate);
                        const endDate = new Date(promo.endDate);
                        return promo.isActive && now >= startDate && now <= endDate; // Lọc theo ngày và isActive
                    })
                    .reduce((best, promo) => {
                        const price = Number(product.price);
                        const discountAmount = Number(promo.discountAmount);

                        if (isNaN(price) || isNaN(discountAmount)) {
                            console.warn(`Invalid price or discountAmount for product ${product.id}, promo ${promo.id}`);
                            return best;
                        }

                        let discountedPrice: number;
                        if (promo.discountType === "percentage") {
                            discountedPrice = price * (1 - discountAmount / 100);
                        } else if (promo.discountType === "fixed") {
                            discountedPrice = price - discountAmount;
                        } else {
                            return best;
                        }

                        discountedPrice = Math.max(discountedPrice, 0);

                        return !best || discountedPrice < best.discountedPrice
                            ? { promotion: promo, discountedPrice }
                            : best;
                    }, null as { promotion: Promotion; discountedPrice: number } | null);
            };

            // Xử lý dữ liệu: Chỉ giữ promotion tốt nhất cho mỗi sản phẩm
            const filteredPromotions = promotions.map(promotion => {
                const productsWithBestPromotion = promotion.products.map(product => {
                    const bestPromoData = getBestPromotion(product);
                    if (bestPromoData) {
                        // Chỉ giữ promotion tốt nhất trong product.promotions
                        product.promotions = [bestPromoData.promotion];
                    } else {
                        product.promotions = []; // Không có promotion hợp lệ
                    }
                    return product;
                });

                return {
                    ...promotion,
                    products: productsWithBestPromotion.filter(product => 
                        product.promotions.length > 0 && 
                        product.promotions[0].id === promotion.id // Chỉ giữ sản phẩm có best promotion trùng với promotion hiện tại
                    )
                };
            }).filter(promotion => promotion.products.length > 0); // Loại bỏ promotion không có sản phẩm

            res.status(200).json({
                success: true,
                data: filteredPromotions
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getProductDetail(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const product = await this.productRepository.findOne({
                where: { id: Number(id) },
                relations: ['fruitType', 'promotions', 'categories', 'productImages']
            });
            res.status(200).json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the product'
            });
        }
    }

    async getProductByPromotion(req: Request, res: Response): Promise<void> {
        try {
            const { promotionId } = req.query;
            if (!promotionId) {
                res.status(400).json({ message: "Promotion ID is required" });
                return;
            }
            const promotion = await this.promotionRepository.findOne({
                where: { id: Number(promotionId), isActive: true },
                relations: ["products"]
            });
            if (!promotion) {
                res.status(404).json({
                    message: "Promotion not found or inactive"
                });
                return;
            }
            const products = promotion.products;
            const detailedProducts = await this.productRepository.find({
                where: { id: In(products.map((p) => p.id)) },
                relations: ["fruitType", "categories", "promotions", "productImages"]
            });
            res.status(200).json({
                success: true,
                data: detailedProducts
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getRelateProduct(req: Request, res: Response): Promise<void> {
        try {
            const { fruitType_id } = req.params;
            const products = await this.productRepository.find({
                where: {
                    fruitType: { id: Number(fruitType_id) }
                },
                relations: ['fruitType']
            });
            res.status(200).json({
                success: true,
                data: products
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the product'
            });
        }
    }
}

export default new ProductController();