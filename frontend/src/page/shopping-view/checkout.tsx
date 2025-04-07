import { useEffect, useState } from "react";
import accImg from '../../assets/906_generated.jpg';
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { createNewOrder } from "@/store/shopping/order-slice";
import { AppDispatch, RootState } from "@/store/store";
import { DiscountCode, Order, ShippingAddress } from "@/config/entity";
import ShoppingAddress from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-item-content";
import { Button } from "@/components/ui/button";
import CouponCode from "@/components/shopping-view/CouponCode";
import { fetchAllCart } from "@/store/shopping/cart-slice";

const initialShippingAddress: ShippingAddress = {
    id: 0,
    user_id: '',
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    is_default: false,
    phoneNumber: 0,
    note: ''
}

const mockCoupon: DiscountCode = {
    id: 1,
    code: 'SUMMER2025',
    amount: 20.0,
    type: 'percentage',
    minOrderValue: 50.0,
    maxUser: 100,
    usedCount: 45,
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-30'),
    isActive: true
};

const ShoppingCheckout = () => {
    const { cartList } = useSelector((state: RootState) => state.userCart);
    const { user } = useSelector((state: RootState) => state.adminAuth);
    const { approvalURL } = useSelector((state: RootState) => state.shopOrder);
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState<ShippingAddress>(initialShippingAddress);
    const [isPaymentStart, setIsPaymentStart] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const { toast } = useToast();
    function handleInitialPaypalPayment() {
        if (cartList.cartDetails.length === 0) {
            toast({
                title: "Your cart is empty. Please add items to proceed",
                variant: "destructive"
            })
            return;
        }
        if (currentSelectedAddress === null) {
            toast({
                title: "Please select one address to proceed",
                variant: "destructive"
            })
            return;
        }
        const orderData: Omit<Order, 'id'> = {
            userId: user.userId,
            cartId: cartList.id,
            discountCodeId: cartList.discount?.id ?? 0,
            subTotal: cartList.totalPrice,
            discountAmount: cartList.discount?.amount ?? 0,
            totalAmount: cartList.discount && cartList.discount
                ? cartList.discount.type == "fixed" ? cartList.totalPrice - cartList!.discount!.amount : cartList.totalPrice - (cartList.totalPrice * cartList.discount.amount / 100)
                : cartList.totalPrice,
            status: 'pending',
            shippingAddressId: currentSelectedAddress?.id,
            paymentMethod: 'paypal',
            paymentStatus: 'pending',
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: '',
            payerId: ''
        }
        dispatch(createNewOrder(orderData)).then((data) => {
            if (data?.payload?.success) {
                setIsPaymentStart(true);
            } else {
                setIsPaymentStart(false);
            }
        })
    }
    if (approvalURL) {
        window.location.href = approvalURL;
    }

    return (
        <div className="flex flex-col">
            <div className="relative h-[300px] w-full overflow-hidden">
                <img src={accImg} alt="" className='h-full w-full object-cover object-center' />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
                <ShoppingAddress selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
                <div className="flex flex-col gap-4">
                    {
                        cartList && cartList.cartDetails && cartList.cartDetails.length > 0
                            ? cartList.cartDetails.map((item) => (
                                <UserCartItemsContent cartItem={item} />
                            ))
                            : null
                    }
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Total: </span>
                            <span className="font-bold">
                                {
                                    cartList.totalPrice
                                }
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Discount Amount: </span>
                            <span className="font-bold">
                                {
                                    cartList.discount ? cartList.discount.type == "fixed" ? `${cartList!.discount?.amount} USD` : `${cartList!.discount?.amount}%` : 0
                                }
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Final Price: </span>
                            <span className="font-bold">
                                {
                                    cartList.discount && cartList.discount
                                        ? cartList.discount.type == "fixed" ? cartList.totalPrice - cartList!.discount!.amount : cartList.totalPrice - (cartList.totalPrice * cartList.discount.amount / 100)
                                        : cartList.totalPrice
                                }
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 w-full">
                        <Button onClick={handleInitialPaypalPayment} className="w-full">
                            {
                                isPaymentStart
                                    ? "Processing Paypal Payment..."
                                    : "Checkout With Paypal0"
                            }
                        </Button>
                    </div>
                    <CouponCode />
                </div>
            </div>
        </div>
    )
}

export default ShoppingCheckout;