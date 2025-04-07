import { AppDataSource } from "@database/data-source";
import { Order } from "@models/orders";
import { Request, Response } from "express";
import { Repository } from "typeorm";

class OrderController {
    private orderRepository: Repository<Order>;

    constructor() {
        this.orderRepository = AppDataSource.getRepository(Order);
    }

    async getAllOrdersOfAllUser(req: Request, res: Response): Promise<void>{
        try {
            const orders = await this.orderRepository.find({
                relations: ['user', 'shippingAddress', 'orderDetails']
            })
            if(!orders.length){
                res.status(404).json({
                    success: false,
                    message: "No orders found"
                })
                return;
            }
            res.status(200).json({
                success: true,
                data: orders
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }

    async getOrderDetailsForAdmin(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            const order = await this.orderRepository.findOne({
                where: {id: Number(id)},
                relations: ['user', 'shippingAddress', 'orderDetails', "orderDetails.product"]
            })
            if(!order){
                res.status(404).json({
                    success: false,
                    message: "No orders found"
                })
                return;
            }
            res.status(200).json({
                success: true,
                data: order
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }

    async updateOrderStatus(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            const {status} = req.body;
            const order = await this.orderRepository.findOne({
                where: {id: Number(id)}
            })
            if(!order){
                res.status(404).json({
                    success: false,
                    message: "No orders found"
                })
                return;
            }
            order.status = status;
            await this.orderRepository.save(order);
            res.status(200).json({
                success: true,
                message: "Order status is updated successfully"
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }
}

export default new OrderController();