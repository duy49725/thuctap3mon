import { AppDataSource } from "@database/data-source";
import { Promotion } from "@models/promotions";
import { Request, Response } from "express";
import { Repository } from "typeorm";

class PromotionController{

    private promotionRepository: Repository<Promotion>;

    constructor(){
        this.promotionRepository = AppDataSource.getRepository(Promotion);
    }

    async getAllPromotion(req: Request, res: Response): Promise<void>{
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const [promotions, totalPromotions] = await this.promotionRepository.findAndCount({
                skip,
                take: limit
            });
            if(!promotions.length){
                res.status(404).json({
                    success: false,
                    message: 'Promotions not found'
                })
                return;
            };
            res.status(200).json({
                success: true,
                data: promotions,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalPromotions/limit),
                    pageSize: limit,
                    totalPromotions
                }
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the promotions'
            })
        }
    }

    async getPromotionById(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            const promotion = await this.promotionRepository.findOne({
                where: {id: Number(id)},
                relations: ['products']
            })
            if(!promotion){
                res.status(404).json({
                    success: false,
                    data: 'Promotion not found'
                })
                return;
            }
            res.status(200).json({
                success: true,
                data: promotion
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the promotion'
            })
        }
    }

    async addPromotion(req: Request, res: Response): Promise<void>{
        try {
            const {name, description, discountAmount, discountType, startDate, endDate, isActive} = req.body;
            const promotion = await this.promotionRepository.create({name, description, discountAmount, discountType, startDate, endDate, isActive});
            await this.promotionRepository.save(promotion);
            res.status(200).json({
                success: true,
                data: 'Add promotion successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while add the promotion'
            })
        }
    }

    async updatePromotion(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            const {name, description, discountAmount, discountType, startDate, endDate, isActive} = req.body;
            await this.promotionRepository.update(id, {name, description, discountAmount, discountType, startDate, endDate, isActive});
            res.status(200).json({
                success: true,
                data: 'Update promotion successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while update the promotion'
            })
        }
    }

    async deletePromotion(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            await this.promotionRepository.delete(id);
            res.status(200).json({
                success: true,
                data: 'Delete promotion successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while delete the promotion'
            })
        }
    }
}

export default new PromotionController();