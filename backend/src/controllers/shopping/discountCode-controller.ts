import { AppDataSource } from "@database/data-source";
import { DiscountCode } from "@models/discountCode";
import { UserCoupon } from "@models/userDiscount";
import { User } from "@models/users";
import { Request, Response } from "express";
import { Repository } from "typeorm";

class discountCodeController{
    private userDiscountRepository: Repository<UserCoupon>;
    private userRepository: Repository<User>;
    private discountCodeRepository: Repository<DiscountCode>;

    constructor(){
        this.userDiscountRepository = AppDataSource.getRepository(UserCoupon);
        this.userRepository = AppDataSource.getRepository(User);
        this.discountCodeRepository = AppDataSource.getRepository(DiscountCode);
    }

    async getAllDiscountCodeByUser(req: Request, res: Response): Promise<void>{
        try {
            const {userId} = req.params;
            const userDiscount = await this.userDiscountRepository.find({
                where: {user: {id: userId}},
                relations: ['user', 'discountCode']
            })
            if(!userDiscount){
                res.status(404).json({
                    success: false,
                    data: 'User don\'t have any coupon code'
                })
                return;
            }
            res.status(200).json({
                success: true,
                data: userDiscount
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while update the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })        
        }
    }

    async getAllDiscountCode(req: Request, res: Response): Promise<void>{
        try {
            const discount = await this.discountCodeRepository.find({
                where: {isActive: true}
            })
            res.status(200).json({
                success: true,
                data: discount
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while update the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })    
        }
    }

    async createSpinningResult(req: Request, res: Response):Promise<void>{
        try {
            const {userId, discountId} = req.params;
            const user = await this.userRepository.findOne({
                where: {id: userId}
            })
            const discount = await this.discountCodeRepository.findOne({
                where: {id: Number(discountId)}
            })
            if(user && discount){
                const newUserDiscount = await this.userDiscountRepository.create({
                    user: user,
                    discountCode: discount,
                    usedAt: undefined
                })
                await this.userDiscountRepository.save(newUserDiscount);
            }
            res.status(200).json({
                success: true,
                data: "Add user discount successfully"
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while update the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })   
        }
    }
}

export default new discountCodeController();