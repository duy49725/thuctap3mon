import { Repository } from "typeorm";
import { AppDataSource } from "@database/data-source";
import { Product } from "@models/products";
import { Category } from "@models/categories";
import { Promotion } from "@models/promotions";
import { FruitType } from "@models/fruitTypes";
import { Request, Response } from "express";
import { imageUploadUtil } from "src/helpers/cloudinary";
import { ProductImage } from "@models/productImage";

class ProductController{
    private productRepository: Repository<Product>;
    private categoryRepository: Repository<Category>;
    private promotionRepository: Repository<Promotion>;
    private fruitTypeRepository: Repository<FruitType>;
    private productImageRepository: Repository<ProductImage>;

    constructor(){
        this.productRepository = AppDataSource.getRepository(Product);
        this.categoryRepository = AppDataSource.getRepository(Category);
        this.promotionRepository = AppDataSource.getRepository(Promotion);
        this.fruitTypeRepository = AppDataSource.getRepository(FruitType);
        this.productImageRepository = AppDataSource.getRepository(ProductImage);
    }

    async getAllProduct(req: Request, res: Response): Promise<void>{
        try {
            const page = Number(req.query.page);
            const limit = Number(req.query.limit);
            const skip = (page - 1) * limit;
            const [products, totalProducts] = await this.productRepository.findAndCount({
                relations: ['categories', 'promotions', 'fruitType', 'productImages'],
                take: limit,
                skip
            });
            if(!products){
                res.status(404).json({
                    success: false,
                    data: 'Product can not be found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: products,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalProducts/limit),
                    pageSize: limit,
                    totalProducts
                }
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }

    async getProductById(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            const product = await this.productRepository.findOne({
                where: {id: Number(id)},
                relations: ['categories', 'promotions', 'fruitType', 'productImages']
            })
            if(!product){
                res.status(404).json({
                    success: false,
                    data: 'Product can not be found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: product
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }

    /*uploadImage = async(file: Express.Multer.File): Promise<string> => {
        const image = file;
        const base64Image = Buffer.from(image.buffer).toString("base64");
        const datauri = `data:${image.mimetype};base64,${base64Image}`;
        const uploadResponse = await cloudinary.v2.uploader.upload(datauri);
        return uploadResponse.url;
    }*/

    async handleImageUpload(req: Request, res: Response): Promise<void>{
        try {
            if(req.file){
                const base64 = Buffer.from(req.file.buffer).toString('base64');
                const url = "data:" + req.file.mimetype + ";base64," + base64;
                const result = await imageUploadUtil(url);
                res.json({
                    success: true,
                    result: result
                })
            }
        } catch (error) {
            res.json({
                success: false,
                message: "Error"
            })
        }
    }

    async getAllProductImages(req: Request, res: Response): Promise<void>{
        try {
            const productImages = await this.productImageRepository.find();
            res.json({
                success: true,
                data: productImages
            })
        } catch (error) {
            res.json({
                success: false,
                message: "Error"
            })
        }
    }

    async addProduct(req: Request, res: Response): Promise<void>{
        try {
            let {category_id, promotion_id, fruitType_id, image, images, ...rest} = req.body;
            console.log('images', images);
            const categories = await Promise.all(
                category_id.map((id: any) => this.categoryRepository.findOneBy({id}))
            )
            const promotions = await Promise.all(
                promotion_id.map((id: any) => this.promotionRepository.findOneBy({id}))
            )
            const fruitType = await this.fruitTypeRepository.findOneBy({id: fruitType_id});
            /*const imageUrl = await this.uploadImage(req.file as Express.Multer.File);
            image = imageUrl;*/
            const product = await this.productRepository.create({...rest, image, categories, promotions, fruitType})
            await this.productRepository.save(product);
            if (images && Array.isArray(images) && images.length > 0) {
                const productImages = images.map((image: string) =>
                    this.productImageRepository.create({
                        product: product as any,
                        image
                    })
                );
                await this.productImageRepository.save(productImages); 
            }
        
            res.status(200).json({
                success: true,
                message: 'Add successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while add the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }

    async updateProduct(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            let { category_id, promotion_id, fruitType_id, image, images, name, description, price, quantity, isActive, unit } = req.body;
    
            const product: any = await this.productRepository.findOne({
                where: { id: Number(id) },
                relations: ['productImages'], 
            });
    
            if (!product) {
                res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm để cập nhật',
                });
                return;
            }

            if (category_id) {
                const categories = await Promise.all(
                    category_id.map((id: any) => this.categoryRepository.findOneBy({ id }))
                );
                product.categories = categories || product.categories;
            }
            if (promotion_id) {
                const promotions = await Promise.all(
                    promotion_id.map((id: any) => this.promotionRepository.findOneBy({ id }))
                );
                product.promotions = promotions || product.promotions;
            }
            if (fruitType_id) {
                const fruitType = await this.fruitTypeRepository.findOneBy({ id: fruitType_id });
                product.fruitType = fruitType as FruitType || product.fruitType;
            }
            product.name = name || product.name;
            product.description = description || product.description;
            product.image = image || product.image;
            product.price = price || product.price;
            product.quantity = quantity || product.quantity;
            product.unit = unit || product.unit;
            product.isActive = isActive !== undefined ? isActive : product.isActive;
            await this.productRepository.save(product);

            if (images && Array.isArray(images) && images.length > 0) {
                if (product.productImages && product.productImages.length > 0) {
                    await this.productImageRepository.delete({
                        product: { id: Number(id) },
                    });
                }
                const newProductImages = images.map((image: string) =>
                    this.productImageRepository.create({
                        product: product,
                        image,
                    })
                );
                await this.productImageRepository.save(newProductImages);
            }
    
            res.status(200).json({
                success: true,
                data: 'Cập nhật sản phẩm thành công',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi cập nhật sản phẩm',
                error: error instanceof Error ? error.message : 'Lỗi không xác định',
            });
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            const product = await this.productRepository.findOne({
                where: { id: Number(id) },
                relations: ['productImages']
            });
    
            if (!product) {
                res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm để xóa'
                });
                return;
            }
            if (product.productImages && product.productImages.length > 0) {
                await this.productImageRepository.delete({
                    product: { id: Number(id) }
                });
            }
            await this.productRepository.delete(id);
            res.status(200).json({
                success: true,
                data: 'delete successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while delete the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }
}

export default new ProductController();