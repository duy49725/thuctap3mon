import { cartDetails, deleteCartItem, fetchAllCart, updateCartItem } from '@/store/shopping/cart-slice'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../ui/button'
import { Minus, Plus, Trash } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { fetchAllProducts } from '@/store/shopping/product-slice'

interface CartItemProps{
    cartItem: cartDetails
}

const UserCartItemsContent = ({cartItem}: CartItemProps) => {
    const {user} = useSelector((state: RootState) => state.adminAuth);
    const {cartList} = useSelector((state: RootState) => state.userCart);
    const {allProduct} = useSelector((state: RootState) => state.shopProduct);
    const dispatch = useDispatch<AppDispatch>();
    const {toast} = useToast();
    const handleCartItemDelete = (cartDetail_id: number) => {
        dispatch(deleteCartItem(cartDetail_id))
            .then((data) => {
                if(data.payload.success){
                    dispatch(fetchAllCart(user?.userId));
                    toast({
                        title: "Cart item is deleted successfully"
                    })
                }
            })
    }
    useEffect(() => {
        dispatch(fetchAllProducts())
    }, [])
    const handleUpdateQuantity = (getCartItem: cartDetails, typeOfAction: string) => {
        if(typeOfAction == 'plus'){
            let getCartItems = cartList.cartDetails || [];
            if(getCartItems.length){
                const indexOfCurrentCartItem = getCartItems.findIndex((item) => item.product.id === getCartItem.product.id);
                const getCurrentProductIndex = allProduct.findIndex((product) => product.id === getCartItem.product.id);
                const getTotalStock = allProduct[getCurrentProductIndex].quantity;
                if(indexOfCurrentCartItem > -1){
                    const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
                    if(getQuantity + 1 > getTotalStock){
                        toast({
                            variant: "destructive",
                            title: `Only ${getQuantity} quantity can be added for this item`,
                        });
                        return;
                    }
                }
            }
        }
        dispatch(
            updateCartItem({
                cartDetail_id: getCartItem.id,
                quantity: typeOfAction === "plus"
                            ? getCartItem?.quantity + 1
                            : getCartItem?.quantity - 1
            })
        ).then((data) => {
            if(data?.payload?.success){
                dispatch(fetchAllCart(user?.userId));
                toast({
                    title: "Cart item is updated successfully"
                })
            }
        })
    }
  return (
    <div className='flex items-center space-x-4'>
        <img src={cartItem.product.image} alt="" className='w-20 h-20 rounded object-cover'/>
        <div className='flex-1'>
            <h3>{cartItem.product?.name}</h3>
            <div className='flex items-center mt-1'>
                <Button 
                    variant='outline' 
                    size='icon' 
                    className='h-8 w-8 rounded-full' 
                    disabled={cartItem?.quantity === 1}
                    onClick={() => handleUpdateQuantity(cartItem, "minus")}
                >
                    <Minus className='w-4 h-4'/>
                    <span className='sr-only'>Decrease</span>
                </Button>
                <span className='font-semibold m-2'>{cartItem.quantity}</span>
                <Button 
                    variant='outline'
                    size='icon'
                    className='h-8 w-8 rounded-full'
                    onClick={() => handleUpdateQuantity(cartItem, "plus")}
                >
                    <Plus className='w-4 h-4'/>
                    <span className='sr-only'>Increase</span>
                </Button>
            </div>
        </div>
        <div className='flex flex-col items-end'>
            <p>
                ${(cartItem.unitPrice * cartItem.quantity).toFixed(2)}
            </p>
            <Trash 
                className='cursor-pointer mt-1'
                onClick={() => {
                    handleCartItemDelete(cartItem.id)
                }}
            />
        </div>
    </div>
  )
}

export default UserCartItemsContent