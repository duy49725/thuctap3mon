import { AppDataSource } from "@database/data-source";
import { ShippingAddress } from "@models/shippingAddress";
import { User } from "@models/users";
import { Request, Response } from "express";
import { Repository } from "typeorm";

class ShippingAddressController{
    private shippingAddressRepository: Repository<ShippingAddress>;
    private userRepository: Repository<User>;
    constructor(){
        this.shippingAddressRepository = AppDataSource.getRepository(ShippingAddress);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async getAllShippingAddress(req: Request, res: Response): Promise<void>{
        try {
            const {userId} = req.params;
            const allShippingAddress = await this.shippingAddressRepository.find({
                where: {user: {id: userId}}
            })
            if(!allShippingAddress){
                res.status(404).json({
                    success: false,
                    data: 'Invalid User'
                })
                return;
            }
            res.status(200).json({
                success: true,
                data: allShippingAddress
            })
        } catch (error) {
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    async createShippingAddress(req: Request, res: Response): Promise<void>{
        try {
            const {userId, fullName, streetAddress, city, state, postal_code, country} = req.body;
            const user = await this.userRepository.findOne({
                where: {id: userId}
            })
            if(!user){
                res.status(404).json({
                    success: false,
                    data: 'Invalid User'
                })
                return;
            }
            const newAddress = await this.shippingAddressRepository.create({
                user: user,
                fullName: fullName,
                streetAddress: streetAddress,
                city: city,
                state: state,
                postal_code: postal_code,
                country: country
            })
            await this.shippingAddressRepository.save(newAddress);
            res.status(200).json({
                success: true,
                data: "Add Shipping Address Successfully"
            })
        } catch (error) {
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    async updateShippingAddress(req: Request, res: Response): Promise<void>{
        try {
            const {id, userId} = req.params;
            const { fullName, streetAddress, city, state, postal_code, country} = req.body;
            const user = await this.userRepository.findOne({
                where: {id: userId}
            }) 
            if(user){
                await this.shippingAddressRepository.update(id, {user, fullName, streetAddress, city, state, postal_code, country});
            }
            res.status(200).json({
                success: true,
                data: 'Update shipping address successfully'
            })
        } catch (error) {
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    async deleteShippingAddress(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            await this.shippingAddressRepository.delete(id);
            res.status(200).json({
                success: true,
                data: 'Update shipping address successfully'
            })
        } catch (error) {
            res.status(500).json({ success: false, message: "Error" });

        }
    }
}

export default new ShippingAddressController();