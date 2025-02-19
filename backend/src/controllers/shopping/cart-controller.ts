import { AppDataSource } from "@database/data-source";
import { CartDetail } from "@models/cartDetail";
import { Cart } from "@models/carts";
import { DiscountCode } from "@models/discountCode";
import { Product } from "@models/products";
import { User } from "@models/users";
import { Request, Response } from "express";
import { MoreThan, Repository } from "typeorm";

class CartController {
    cartRepositoty: Repository<Cart>;
    productRepository: Repository<Product>;
    userRepository: Repository<User>;
    discountRepository: Repository<DiscountCode>;
    cartDetailRepository: Repository<CartDetail>;
    constructor() {
        this.cartRepositoty = AppDataSource.getRepository(Cart);
        this.productRepository = AppDataSource.getRepository(Product);
        this.userRepository = AppDataSource.getRepository(User);
        this.discountRepository = AppDataSource.getRepository(DiscountCode);
        this.cartDetailRepository = AppDataSource.getRepository(CartDetail);
    }

    async addToCart(req: Request, res: Response): Promise<void> {
        try {
            const { product_id, userId, quantity, unitPrice } = req.body;
            const product = await this.productRepository.findOne({
                where: { id: Number(product_id), isActive: true, quantity: MoreThan(quantity) }
            })
            if (!product) {
                res.status(404).json({
                    success: false,
                    data: "Add failed"
                })
                return;
            }
            const CurrentUser = await this.userRepository.findOne({
                where: { id: String(userId) }
            })
            if (!CurrentUser) {
                res.status(404).json({
                    success: false,
                    data: "Add failed"
                })
                return;
            }
            let CurrentCart = await this.cartRepositoty.findOne({
                where: { user: {id: CurrentUser.id}},
                relations: ['cartDetails']
            })
            if(!CurrentCart){
                CurrentCart = this.cartRepositoty.create({
                    user: CurrentUser,
                    cartDetails: []
                })
                await this.cartRepositoty.save(CurrentCart);
            }
            let cartDtail = await this.cartDetailRepository.findOne({
                where: {cart: {id: CurrentCart.id}, product: {id: product_id}}
            })
            if(cartDtail){
                cartDtail.quantity += quantity;
            }else{
                cartDtail = this.cartDetailRepository.create({
                    cart: CurrentCart,
                    product: product,
                    quantity: quantity,
                    unitPrice: unitPrice
                })
            }
            await this.cartDetailRepository.save(cartDtail);
           
            res.status(200).json({
                success: true,
                data: "Add To Cart Successfully"
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    async updateFormCart(req: Request, res: Response): Promise<void>{
        try {
            const {cartDetail_Id, quantity} = req.body;
            const cartDetail = await this.cartDetailRepository.findOne({
                where: {id: cartDetail_Id}
            })
            if(!cartDetail){
                res.status(404).json({
                    success: false,
                    data: "Invalid cart Item"
                })
                return;
            }
            cartDetail.quantity = quantity;
            await this.cartDetailRepository.save(cartDetail);
            res.status(200).json({
                success: true,
                data: "Update To Cart Successfully"
            })
        } catch (error) {
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    async removeFromCart(req: Request, res: Response): Promise<void>{
        try {
            const {cartDetail_Id} = req.params;
            const cartDetail = await this.cartDetailRepository.findOne({
                where: {id: Number(cartDetail_Id)}
            })
            if(!cartDetail){
                res.status(404).json({
                    success: false,
                    data: "Invalid cart Item"
                })
                return;
            }
            await this.cartDetailRepository.remove(cartDetail);
            res.status(200).json({
                success: true,
                data: "Remove From Cart Successfully"
            })
        } catch (error) {
            res.status(500).json({ success: false, message: "Error" });
        }
    }
}

export default new CartController();