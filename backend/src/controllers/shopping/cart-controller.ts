import { AppDataSource } from "@database/data-source";
import { CartDetail } from "@models/cartDetail";
import { Cart } from "@models/carts";
import { DiscountCode } from "@models/discountCode";
import { Product } from "@models/products";
import { User } from "@models/users";
import { Request, Response } from "express";
import { MoreThanOrEqual, Repository } from "typeorm";

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

    async getCartUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const userCart = await this.cartRepositoty.findOne({
                where: {
                    user: { id: userId },
                },
                relations: ['cartDetails', 'cartDetails.product'],
            });

            if (!userCart) {
                res.status(404).json({
                    success: false,
                    data: "User don't have any item in cart",
                });
                return
            }

            // Xử lý bất đồng bộ để xóa các cartDetail không hợp lệ
            const validCartDetails = [];
            for (const detail of userCart.cartDetails) {
                if (!detail.product || !detail.product.isActive) {
                    await this.cartDetailRepository.remove(detail); // Await để đảm bảo xóa xong
                } else {
                    validCartDetails.push(detail);
                }
            }
            userCart.cartDetails = validCartDetails;

            // Tính tổng giá
            const listPrice = userCart.cartDetails.map(cartDetail => ({
                unitPrice: cartDetail.unitPrice,
                quantity: cartDetail.quantity,
            }));
            const totalPrice = listPrice.reduce((total, value) => total + value.unitPrice * value.quantity, 0);

            res.status(200).json({
                success: true,
                data: { ...userCart, totalPrice },
            });
            return
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    async applyCouponCode(req: Request, res: Response): Promise<void> {
        try {
            const { discountCode_id } = req.body;
            const { userId } = req.params;
            const discount = await this.discountRepository.findOne({
                where: { id: Number(discountCode_id) }
            })
            if (!discount) {
                res.status(400).json({
                    success: false,
                    data: "Invalid discount code"
                })
                return;
            }
            const userCart = await this.cartRepositoty.findOne({
                where: { user: { id: userId } },
                relations: ['cartDetails', 'cartDetails.product']
            })
            if (!userCart) {
                res.status(400).json({
                    success: false,
                    data: "Invalid User"
                })
                return;
            }
            const listPrice = userCart.cartDetails.map(cartDetail => cartDetail.unitPrice);
            const totalPrice = listPrice.reduce((total, value) => total + value);
            if (discount.minOrderValue && totalPrice < discount.minOrderValue) {
                res.status(400).json({
                    success: false,
                    data: `Your order must be more than ${discount.minOrderValue} to apply this coupon code`
                })
                return;
            }
            userCart.discount = discount;
            await this.cartRepositoty.save(userCart);
            res.status(200).json({
                success: true,
                data: 'Apply coupon code successfully'
            })
        } catch (error) {
            res.status(500).json({ success: false, message: "Error" });
        }
    }

    async addToCart(req: Request, res: Response): Promise<void> {
        try {
            const { product_id, userId, quantity, unitPrice } = req.body;
            const product = await this.productRepository.findOne({
                where: { id: Number(product_id), isActive: true, quantity: MoreThanOrEqual(quantity) }
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
                where: { user: { id: CurrentUser.id } },
                relations: ['cartDetails']
            })
            if (!CurrentCart) {
                CurrentCart = this.cartRepositoty.create({
                    user: CurrentUser,
                    cartDetails: []
                })
                await this.cartRepositoty.save(CurrentCart);
            }
            let cartDtail = await this.cartDetailRepository.findOne({
                where: { cart: { id: CurrentCart.id }, product: { id: product_id } }
            })
            if (cartDtail) {
                cartDtail.quantity += quantity;
            } else {
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

    async updateFormCart(req: Request, res: Response): Promise<void> {
        try {
            const { cartDetail_id, quantity } = req.body;
            const cartDetail = await this.cartDetailRepository.findOne({
                where: { id: cartDetail_id }
            })
            if (!cartDetail) {
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

    async removeFromCart(req: Request, res: Response): Promise<void> {
        try {
            const { cartDetail_Id } = req.params;
            const cartDetail = await this.cartDetailRepository.findOne({
                where: { id: Number(cartDetail_Id) }
            })
            if (!cartDetail) {
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