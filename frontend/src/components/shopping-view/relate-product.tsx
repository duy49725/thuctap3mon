import { fetchRelatedProduct, fetchShoppingProductDetail } from '@/store/shopping/product-slice';
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ShoppingProductTile from './product-tile';
import { useToast } from '@/hooks/use-toast';
import { addToCart, fetchAllCart } from '@/store/shopping/cart-slice';

const RelateProduct = ({fruitTypeId} : {fruitTypeId: number | undefined}) => {
    const {relateProduct} = useSelector((state: RootState) => state.shopProduct);
    const { cartList, isLoading } = useSelector((state: RootState) => state.userCart);
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.adminAuth);
    const { toast } = useToast();
    useEffect(() => {
      dispatch(fetchRelatedProduct(fruitTypeId))
    },[dispatch, fruitTypeId])
    function handleGetProductDetails(getCurrentProductId: number) {
      dispatch(fetchShoppingProductDetail(getCurrentProductId));
    }
    function handleAddToCart(getCurrentProductId: number, getTotalStock: number, unitPrice: number) {
        let getCartItems = cartList.cartDetails || [];
        if (getCartItems.length) {
          const indexOfCurrentItem = getCartItems.findIndex(
            (item) => item.product.id === getCurrentProductId
          )
          if (indexOfCurrentItem > -1) {
            const getQuantity = getCartItems[indexOfCurrentItem].quantity;
            if (getQuantity + 1 > getTotalStock) {
              toast({
                title: `Only ${getQuantity} quantity can be added for this item`,
                variant: "destructive"
              })
              return;
            }
          }
        }
        dispatch(addToCart({ userId: user?.userId, product_id: getCurrentProductId, quantity: 1, unitPrice: unitPrice }))
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
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full place-items-center'>
        {
          relateProduct.map((product) => (
              <ShoppingProductTile handleGetProductDetails={handleGetProductDetails} product={product} key={product.id} handleAddToCart={handleAddToCart} className={''}/>
          ))
        }
    </div>
  )
}

export default RelateProduct