import { AppDataSource } from "@database/data-source";
import { Product } from "@models/products";
import { Request, Response } from "express";
import { Repository } from "typeorm";

class ProductController {
    productRepository: Repository<Product>;

    constructor() {
        this.productRepository = AppDataSource.getRepository(Product);
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
                .addSelect(`
                    COALESCE(
                        CASE 
                            WHEN promotion.id IS NOT NULL AND promotion.discountType = 'percentage' 
                            THEN product.price * (1 - promotion.discountAmount / 100)
                            WHEN promotion.id IS NOT NULL AND promotion.discountType = 'fixed' 
                            THEN product.price - promotion.discountAmount
                            ELSE product.price 
                        END, 
                    product.price)`, "finalPrice"
                )
                .groupBy("product.id")
                .limit(Number(limit));

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
                if(fruitTypeIds.length > 0){
                    query.andWhere("fruitType.id IN (:...fruitTypeIds)", { fruitTypeIds });
                }
            }

            if (minPrice !== undefined) {
                query.andWhere(`
                    COALESCE(
                        CASE 
                            WHEN promotion.id IS NOT NULL AND promotion.discountType = 'percentage' 
                            THEN product.price * (1 - promotion.discountAmount / 100)
                            WHEN promotion.id IS NOT NULL AND promotion.discountType = 'fixed' 
                            THEN product.price - promotion.discountAmount
                            ELSE product.price 
                        END, 
                    product.price) >= :minPrice
                `, { minPrice });
            }
            
            if (maxPrice !== undefined) {
                query.andWhere(`
                    COALESCE(
                        CASE 
                            WHEN promotion.id IS NOT NULL AND promotion.discountType = 'percentage' 
                            THEN product.price * (1 - promotion.discountAmount / 100)
                            WHEN promotion.id IS NOT NULL AND promotion.discountType = 'fixed' 
                            THEN product.price - promotion.discountAmount
                            ELSE product.price 
                        END, 
                    product.price) <= :maxPrice
                `, { maxPrice });
            }

            if (sort) {
                if (sort === "price_asc") query.orderBy("finalPrice", "ASC").addOrderBy("product.id", "ASC")
                else if (sort === "price_desc") query.orderBy("finalPrice", "DESC").addOrderBy("product.id", "DESC");
                else if (sort === "quantity") query.orderBy("product.quantity", "DESC");
                else if (sort === "newest") query.orderBy("product.createdAt", "DESC");
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

    async getProductDetail(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            console.log(id)
            const product = await this.productRepository.findOne({
                where: { id: Number(id) },
                relations: ['fruitType', 'promotions', 'categories']
            })
            res.status(200).json({
                success: true,
                data: product
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the product'
            })
        }
    }
}

export default new ProductController();