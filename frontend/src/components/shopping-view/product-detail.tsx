import { useToast } from "@/hooks/use-toast";
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent } from "../ui/dialog";
import { setProductDetails } from "@/store/shopping/product-slice";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { addToCart, fetchAllCart } from "@/store/shopping/cart-slice";
import { ProductResponse } from "@/config/entity";
import { AppDispatch, RootState } from "@/store/store";

interface productDetailsProps{
    open: boolean,
    setOpen: (b: boolean) => void,
    productDetails: ProductResponse | null
}

const ProductDetailsDialog = ({open, setOpen, productDetails}: productDetailsProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const {cartList} = useSelector((state: RootState) => state.userCart);
    const {toast} = useToast();
    function handleDialogClose(){
        setOpen(false);
        dispatch(setProductDetails());
    }
    return(
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
                <div className="relative overflow-hidden rounded-lg">
                    <img src={productDetails?.image} alt={productDetails?.name} />
                </div>
                <div className="flex flex-col gap-5">
                    <div>
                        <h1 className="text-3xl font-extrabold">{productDetails?.name}</h1>
                    </div>
                    <div className="flex items-center justify-between">
                        <p></p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProductDetailsDialog;