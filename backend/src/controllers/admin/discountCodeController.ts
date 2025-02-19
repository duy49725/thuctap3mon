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
}