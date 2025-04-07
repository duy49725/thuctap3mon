import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent } from "../ui/dialog";
import { setProductDetails } from "@/store/shopping/product-slice";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { addToCart, fetchAllCart } from "@/store/shopping/cart-slice";
import { ProductResponse } from "@/config/entity";
import { AppDispatch, RootState } from "@/store/store";
import { Minus, Plus } from "lucide-react";

interface productDetailsProps {
    open: boolean,
    setOpen: (b: boolean) => void,
    productDetails: ProductResponse | null
}

const ProductDetailsDialog = ({ open, setOpen, productDetails }: productDetailsProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { cartList } = useSelector((state: RootState) => state.userCart);
    const { user } = useSelector((state: RootState) => state.adminAuth);
    const { toast } = useToast();
    const [productQuantity, setProductQuantity] = useState<number>(1);
    function handleProductQuantity(type: string) {
        if (type === "plus") {
            setProductQuantity((prev: number) => prev + 1);
        } else if (type === "minus") {
            if (productQuantity > 0) {
                setProductQuantity((prev: number) => prev - 1);
            } else {
                toast({
                    title: "Product quantity cannot be negative",
                    variant: "destructive",
                });
            }
        }
    }
    function handleDialogClose() {
        setOpen(false);
        dispatch(setProductDetails());
    }

    const getBestDiscountedPrice = (product: ProductResponse) => {
        if (!product.promotions || product.promotions.length === 0) {
            return {
                bestPrice: parseFloat(String(product.price)),
                bestDiscountType: null,
                discountAmount: 0
            };
        }

        return product.promotions.reduce(
            (best: { bestPrice: number; bestDiscountType: string | null; discountAmount: number }, promo) => {
                let discountedPrice: number;

                if (promo.discountType === "percentage") {
                    discountedPrice = product.price * (1 - parseFloat(String(promo.discountAmount)) / 100);
                } else if (promo.discountType === "fixed") {
                    discountedPrice = product.price - parseFloat(String(promo.discountAmount));
                } else {
                    return best;
                }

                return discountedPrice < best.bestPrice
                    ? { bestPrice: discountedPrice, bestDiscountType: promo.discountType, discountAmount: parseFloat(String(promo.discountAmount)) }
                    : best;
            },
            {
                bestPrice: parseFloat(String(product.price)),
                bestDiscountType: null,
                discountAmount: 0
            }
        );
    };
    const { bestPrice, bestDiscountType, discountAmount } = productDetails
        ? getBestDiscountedPrice(productDetails)
        : { bestPrice: 0, bestDiscountType: null, discountAmount: 0 };

    function handleAddToCart(getCurrentProductId: number, getTotalStock: number, unitPrice: number) {
        let getCartItems = cartList.cartDetails || [];
        if (getCartItems.length) {
            const indexOfCurrentItem = getCartItems.findIndex(
                (item) => item.product.id === getCurrentProductId
            )
            if (indexOfCurrentItem > -1) {
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                if (getQuantity + productQuantity > getTotalStock) {
                    toast({
                        title: `Only ${getTotalStock - getQuantity} quantity can be added for this item`,
                        variant: "destructive"
                    })
                    return;
                }
            }
        }
        dispatch(addToCart({ userId: user?.userId, product_id: getCurrentProductId, quantity: productQuantity, unitPrice: unitPrice }))
            .then(data => {
                if (data?.payload?.success) {
                    dispatch(fetchAllCart(user?.userId));
                    toast({
                        title: "Product is added to cart"
                    })
                }
            })
    }
    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
                <div className="relative overflow-hidden rounded-lg">
                    <img src={productDetails?.image} alt={productDetails?.name} />
                </div>
                <div className="flex flex-col gap-5">
                    <div>
                        <h3 className="text-3xl font-extrabold">Name: {productDetails?.name}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                        <p>Price: {bestPrice}</p>
                        <p>Unit: {productDetails?.unit}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p>Quantity: </p>
                        <div className="flex items-center">
                            <Button onClick={() => {
                                handleProductQuantity("minus")
                            }} className="border-none outline-none rounded-none"><Minus /></Button>
                            <Input className="w-[60px] rounded-none" type="number" value={productQuantity} placeholder={`${productQuantity}`} />
                            <Button onClick={() => {
                                handleProductQuantity("plus")
                            }} className="border-none outline-none rounded-none"><Plus /></Button>
                        </div>
                    </div>
                    <div>
                        <p>Description: </p>
                        <p>{productDetails?.description}</p>
                    </div>
                    {
                        productDetails && productDetails?.quantity === 0
                            ? <Button className="w-full opacity-65 cursor-not-allowed">
                                Out Of Stock
                            </Button>
                            : <Button
                                className="w-full bg-red-400"
                                onClick={() => {
                                    if (productDetails) {
                                        handleAddToCart(productDetails?.id, productDetails?.quantity, bestPrice)
                                        setProductQuantity(1)
                                    }
                                }}
                            >
                                Add to cart
                            </Button>
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProductDetailsDialog;