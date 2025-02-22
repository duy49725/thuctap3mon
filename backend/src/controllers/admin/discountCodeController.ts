import { AppDataSource } from "@database/data-source";
import { DiscountCode } from "@models/discountCode";
import { Request, Response } from "express";

class DiscountCodeController{
    private discountCodeRepository;
    constructor(){
        this.discountCodeRepository = AppDataSource.getRepository(DiscountCode);
    }

    async getAllDiscountCode(req: Request, res: Response): Promise<void>{
        try {
            const discountCodes = await this.discountCodeRepository.find();
            if(!discountCodes){
                res.status(404).json({
                    success: false,
                    data: 'Can not found discount code'
                })
                return;
            }
            res.status(200).json({
                success: true,
                data: discountCodes
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                data: 'An error occurred while retrieving discount code',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    async getDiscountCodeById(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const discountCode = await this.discountCodeRepository.findOne({
                where: {id: Number(id)}
            })
            if(!discountCode){
                res.status(404).json({
                    success: false,
                    data: 'Cant not found discount code'
                })
                return;
            }
            res.status(200).json({
                success: true,
                data: discountCode
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                data: 'An error occurred while retrieving discount code',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    async createDiscountCode(req: Request, res: Response): Promise<void>{
        try {
            const {code, amount, type, minOrderValue, maxUser, usedCount, startDate, endDate, isActive} = req.body;
            const newDiscountCode = await this.discountCodeRepository.create({code, amount, type, minOrderValue, maxUser, usedCount, startDate, endDate, isActive});
            await this.discountCodeRepository.save(newDiscountCode);
            res.status(200).json({
                success: true,
                data: 'Add discount successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                data: 'An error occurred while add discount code',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    async updateDiscountCode(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            const {code, amount, type, minOrderValue, maxUser, usedCount, startDate, endDate, isActive} = req.body;
            await this.discountCodeRepository.update(id, {code, amount, type, minOrderValue, maxUser, usedCount, startDate, endDate, isActive});
            res.status(200).json({
                success: true,
                data: 'Update discount successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                data: 'An error occurred while add discount code',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    async deleteDiscountCode(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            await this.discountCodeRepository.delete(id);
            res.status(200).json({
                success: true,
                data: 'Delete discount successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                data: 'An error occurred while add discount code',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }
}

export default new DiscountCodeController();