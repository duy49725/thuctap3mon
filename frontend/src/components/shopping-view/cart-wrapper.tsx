import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { cartDetails } from '@/store/shopping/cart-slice';
import UserCartItemsContent from './cart-item-content';
import { Button } from '../ui/button';
import { DiscountCode } from '@/config/entity';

interface UserCartProps {
    cartItems: cartDetails[];
    setOpenCartSheet: (b: boolean) => void;
    totalCartAmount: number;
    discount: DiscountCode | null
}

const UserCartWrapper = ({ cartItems, setOpenCartSheet, totalCartAmount, discount }: UserCartProps) => {
    const navigate = useNavigate();
    console.log({ cartItems, setOpenCartSheet, totalCartAmount, discount });
    return (
        <SheetContent className='sm:max-w-md'>
            <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
            </SheetHeader>
            <div className='mt-8 space-y-4'>
                {
                    cartItems && cartItems.length > 0
                        ? cartItems.map(item => <UserCartItemsContent cartItem={item} />)
                        : null
                }
            </div>
            <div className='mt-8 space-y-4'>
                <div className='flex justify-between'>
                    <span className='font-bold'>Total:</span>
                    <span className='font-bold'>
                       {totalCartAmount}
                    </span>
                </div>
            </div>
            <Button
                onClick={() => {
                    navigate('/shopping/checkout')
                    setOpenCartSheet(false)
                }}
                className='w-full mt-6'
            >
                Checkout
            </Button>
        </SheetContent>
    )
}

export default UserCartWrapper