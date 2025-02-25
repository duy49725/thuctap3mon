import { AppDataSource } from "@database/data-source";
import { Cart } from "@models/carts";
import { DiscountCode } from "@models/discountCode";
import { OrderDetail } from "@models/orderDetail";
import { Order } from "@models/orders";
import { Product } from "@models/products";
import { ShippingAddress } from "@models/shippingAddress";
import { User } from "@models/users";
import { error } from "console";
import { Request, Response } from "express";
import paypal from '../../helpers/paypal';
import { Repository } from "typeorm";
import { order } from "paypal-rest-sdk";
import { CartDetail } from "@models/cartDetail";

class OrderController {
    private orderRepository: Repository<Order>;
    private userRepository: Repository<User>;
    private shippingAddressRepository: Repository<ShippingAddress>;
    private cartRepository: Repository<Cart>;
    private cartDetailRepositor: Repository<CartDetail>;
    private discountRepository: Repository<DiscountCode>;
    private orderDetailRepository: Repository<OrderDetail>;
    private productRepository: Repository<Product>;

    constructor() {
        this.orderRepository = AppDataSource.getRepository(Order);
        this.userRepository = AppDataSource.getRepository(User);
        this.shippingAddressRepository = AppDataSource.getRepository(ShippingAddress);
        this.cartRepository = AppDataSource.getRepository(Cart);
        this.cartDetailRepositor = AppDataSource.getRepository(CartDetail);
        this.discountRepository = AppDataSource.getRepository(DiscountCode);
        this.orderDetailRepository = AppDataSource.getRepository(OrderDetail);
        this.productRepository = AppDataSource.getRepository(Product);
    }

    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const {
                userId,
                cartId,
                discountCodeId,
                subTotal,
                discountAmount,
                totalAmount,
                status,
                shippingAddressId,
                paymentMethod,
                paymentStatus,
                orderDate,
                orderUpdateDate,
                paymentId,
                payerId,
            } = req.body;

            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ success: false, message: "User not found" });
                return;
            }

            const discount = discountCodeId
                ? await this.discountRepository.findOne({ where: { id: Number(discountCodeId) } })
                : null;

            const shippingAddress = await this.shippingAddressRepository.findOne({
                where: { id: Number(shippingAddressId) },
            });
            if (!shippingAddress) {
                res.status(404).json({ success: false, message: "Shipping address not found" });
                return;
            }

            const cart = await this.cartRepository.findOne({
                where: { id: cartId },
                relations: ["cartDetails", "cartDetails.product"],
            });
            if (!cart) {
                res.status(404).json({ success: false, message: "Cart not found" });
                return;
            }

            const create_payment_json = {
                intent: "sale",
                payer: { payment_method: "paypal" },
                redirect_urls: {
                    return_url: "http://localhost:5173/shopping/paypal-return",
                    cancel_url: "http://localhost:5173/shopping/paypal-cancel",
                },
                transactions: [
                    {
                        item_list: {
                            items: cart.cartDetails.map((item) => ({
                                name: item.product.name,
                                sku: item.product.id.toString(),
                                price: item.unitPrice.toFixed(2),
                                currency: "USD",
                                quantity: item.quantity,
                            })),
                        },
                        amount: {
                            currency: "USD",
                            total: totalAmount.toFixed(2),
                        },
                        description: "Payment for order",
                    },
                ],
            };

            const paymentInfo = await new Promise<paypal.PaymentResponse>((resolve, reject) => {
                paypal.payment.create(create_payment_json, (error, payment) => {
                    if (error) reject(error);
                    else resolve(payment);
                });
            });

            const newOrder = await this.orderRepository.create({
                user,
                cart: cart,
                discountCode: discount || undefined,
                subTotal,
                discountAmount,
                totalAmount,
                status: status || "pending",
                shippingAddress,
                paymentMethod,
                orderDate: orderDate ? new Date(orderDate) : undefined,
                orderUpdateDate: orderUpdateDate ? new Date(orderUpdateDate) : undefined,
                paymentStatus: paymentStatus || "pending",
                paymentId: paymentInfo.id,
                payerId: payerId || "",
            });

            await this.orderRepository.save(newOrder);

            for(let item of cart.cartDetails){
                const newOrderDetail = await this.orderDetailRepository.create({
                    order: newOrder,
                    product: item.product,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                })
                await this.orderDetailRepository.save(newOrderDetail);
            }

            const approvalUrl = paymentInfo.links?.find((link) => link.rel === "approval_url")?.href;

            res.status(200).json({
                success: true,
                data: {
                    orderId: newOrder.id,
                    approvalUrl,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Error while creating order",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    async capturePayment(req: Request, res: Response): Promise<void> {
        try {
            const { paymentId, payerId, orderId } = req.body;
            console.log("Request body:", req.body);
    
            if (!paymentId || !payerId || !orderId) {
                res.status(400).json({
                    success: false,
                    message: "Missing paymentId, payerId, or orderId",
                });
                return;
            }
    
            const order = await this.orderRepository.findOne({
                where: { id: Number(orderId) },
                relations: ["cart"], // Ensure cart relation is loaded
            });
            if (!order) {
                res.status(404).json({
                    success: false,
                    message: "Order not found",
                });
                return;
            }
    
            const execute_payment_json = {
                payer_id: payerId as string,
            };
    
            const payment = await new Promise<paypal.PaymentResponse>((resolve, reject) => {
                paypal.payment.execute(paymentId as string, execute_payment_json, (error, payment) => {
                    if (error) reject(error);
                    else resolve(payment);
                });
            });
    
            // Update order details
            order.paymentId = paymentId as string;
            order.payerId = payerId as string;
            order.paymentStatus = "Completed";
            order.status = "processing";
            await this.orderRepository.save(order);
            console.log("Order updated successfully:", order.id);
    
            // Update product quantities
            const orderDetails = await this.orderDetailRepository.find({
                where: { order: { id: orderId } },
                relations: ["product"],
            });
            for (let item of orderDetails) {
                const product = await this.productRepository.findOne({
                    where: { id: item.product.id },
                });
                if (!product) {
                    res.status(404).json({
                        success: false,
                        message: `Product not found: ${item.product.id}`,
                    });
                    return;
                }
                product.quantity -= item.quantity;
                await this.productRepository.save(product);
                console.log(`Updated product ${product.id}, new quantity: ${product.quantity}`);
            }
    
            // Remove the cart
            const cart = await this.cartRepository.findOne({
                where: { id: order.cart.id },
                relations: ["cartDetails"], // Load cartDetails to inspect
            });
            if (!cart) {
                console.warn("Cart not found for order:", order.cart.id);
            } else {
                for(let item of cart?.cartDetails){
                    const cartDetail = await this.cartDetailRepositor.findOne({
                        where: {cart: {id: cart.id}}
                    })
                    if(cartDetail){
                        await this.cartDetailRepositor.remove(cartDetail);
                    }
                }
            }
    
            res.status(200).json({
                success: true,
                data: {
                    order,
                    message: "Payment captured successfully",
                },
            });
        } catch (error) {
            console.error("Error in capturePayment:", error);
            res.status(500).json({
                success: false,
                message: "Error while capturing payment",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    async getOrderDetail(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const order = await this.orderRepository.findOne({
                where: { id: Number(id) },
                relations: ["user", "discountCode", "shippingAddress"]
            });
            if (!order) {
                res.status(404).json({ success: false, message: "Order not found" });
                return;
            }
            res.status(200).json({
                success: true,
                data: order
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error while fetching order",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    async getAllOrderOfUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const orders = await this.orderRepository.find({
                where: { user: { id: userId } },
                relations: ["user", "discountCode", "shippingAddress"]
            });
            if (!orders || orders.length === 0) {
                res.status(404).json({ success: false, message: "No orders found for this user" });
                return;
            }
            res.status(200).json({
                success: true,
                data: orders,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error while fetching order",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}


export default new OrderController();