import RelateProduct from '@/components/shopping-view/relate-product';
import ReviewForm from '@/components/shopping-view/review';
import ReviewProduct from '@/components/shopping-view/reviewProduct';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductResponse } from '@/config/entity';
import { toast } from '@/hooks/use-toast';
import { addToCart, fetchAllCart } from '@/store/shopping/cart-slice';
import { fetchShoppingProductDetail, setProductDetails } from '@/store/shopping/product-slice';
import { AppDispatch, RootState } from '@/store/store';
import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { productId } = useParams();
    const { productDetail } = useSelector((state: RootState) => state.shopProduct);
    const { user } = useSelector((state: RootState) => state.adminAuth);
    const { cartList } = useSelector((state: RootState) => state.userCart);
    const [productQuantity, setProductQuantity] = useState<number>(1);
    const [mainImage, setMainImage] = useState<string | undefined>(productDetail?.image); // State for main image

    function handleProductQuantity(type: string) {
        if (type === "plus") {
            setProductQuantity((prev: number) => prev + 1);
        } else if (type === "minus") {
            if (productQuantity > 0) {
                setProductQuantity((prev: number) => prev - 1);
            } else {
                toast({
                    title: "Product quantity cannot be negative",
                    variant: "destructive"
                });
            }
        }
    }

    const getBestDiscountedPrice = (product: ProductResponse) => {
        if (!product.promotions || product.promotions.length === 0) {
            return {
                bestPrice: parseFloat(String(product.price)),
                bestDiscountType: null,
                discountAmount: 0
            }
        }
        return product.promotions.reduce(
            (best: { bestPrice: number; bestDiscountType: string | null; discountAmount: number }, promo) => {
                let discountPrice: number;
                if (promo.discountType === "Percentage") {
                    discountPrice = product.price * (1 - parseFloat(String(promo.discountAmount)) / 100);
                } else if (promo.discountType === "fixed") {
                    discountPrice = product.price - parseFloat(String(promo.discountAmount));
                } else {
                    return best;
                }
                return discountPrice < best.bestPrice
                    ? { bestPrice: discountPrice, bestDiscountType: promo.discountType, discountAmount: parseFloat(String(promo.discountAmount)) }
                    : best
            },
            {
                bestPrice: parseFloat(String(product.price)),
                bestDiscountType: null,
                discountAmount: 0
            }
        )
    }

    const { bestPrice, bestDiscountType, discountAmount } = productDetail
        ? getBestDiscountedPrice(productDetail)
        : { bestPrice: 0, bestDiscountType: null, discountAmount: 0 };

    function handleAddToCart(getCurrentProductId: number, getTotalStock: number, unitPrice: number) {
        let getCartItems = cartList && cartList.cartDetails || [];
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

    useEffect(() => {
        if (productId) {
            dispatch(fetchShoppingProductDetail(Number(productId)));
        }
        return () => {
            dispatch(setProductDetails());
        };
    }, [dispatch, productId]);

    // Update main image when productDetail changes
    useEffect(() => {
        if (productDetail?.image) {
            setMainImage(productDetail.image);
        }
    }, [productDetail]);

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]'>
                {/* Updated Image Section */}
                <div className='flex flex-col gap-4'>
                    {/* Main Image */}
                    <div className='relative overflow-hidden rounded-lg'>
                        <img src={mainImage || productDetail?.image} alt={productDetail?.name} className="w-full" />
                    </div>
                    {/* Thumbnail Images */}
                    <div className='flex gap-2'>
                        {productDetail?.productImages && (
                            <>
                                {/* Include main image as a thumbnail */}
                                <img
                                    src={productDetail.image}
                                    alt="Main Thumbnail"
                                    className="w-16 h-16 object-cover cursor-pointer border-2 border-gray-300 hover:border-blue-500"
                                    onClick={() => setMainImage(productDetail.image)}
                                />
                                {/* Additional product images */}
                                {productDetail.productImages.map((item) => (
                                    <img
                                        key={item.id}
                                        src={item.image}
                                        alt="Thumbnail"
                                        className="w-16 h-16 object-cover cursor-pointer border-2 border-gray-300 hover:border-blue-500"
                                        onClick={() => setMainImage(item.image)}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* Rest of the UI remains unchanged */}
                <div className='flex flex-col gap-5'>
                    <div>
                        <h3 className='text-3xl'>Name: {productDetail?.name}</h3>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p>Price: {bestPrice}</p>
                        <p>Unit: {productDetail?.unit}</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p>Quantity: </p>
                        <div className='flex items-center'>
                            <Button
                                onClick={() => {
                                    handleProductQuantity("minus")
                                }}
                                className='border-none outline-none rounded-none'
                            >
                                <Minus />
                            </Button>
                            <Input className="w-[60px] rounded-none" type="number" value={productQuantity} placeholder={`${productQuantity}`} />
                            <Button
                                onClick={() => {
                                    handleProductQuantity("plus")
                                }}
                                className='border-none outline-none rounded-none'
                            >
                                <Plus />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <p>Description: </p>
                        <p>{productDetail?.description}</p>
                    </div>
                    {
                        productDetail && productDetail?.quantity === 0
                            ? <Button className='w-full opacity-65 cursor-not-allowed'>
                                Out Of Stock
                            </Button>
                            : <Button
                                className='w-full bg-red-400'
                                onClick={() => {
                                    handleAddToCart(productDetail!.id, productDetail!.quantity, bestPrice)
                                    setProductQuantity(1)
                                }}
                            >
                                Add To Cart
                            </Button>
                    }
                </div>
            </div>
            <div className='flex flex-col w-[70vw] justify-center items-center gap-10'>
                <p className='w-full text-4xl text-center'>Relate Fruit</p>
                <RelateProduct fruitTypeId={productDetail?.fruitType.id} />
                <ReviewForm productId={productDetail?.id} productName={productDetail?.name} key={productDetail?.id} />
                <ReviewProduct productId={productDetail?.id} />
            </div>
        </div>
    )
}

export default ProductDetail;