import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CouponCard from './CouponCard';
import { fetchallUserDiscountCode } from '@/store/shopping/userDiscount-slice';



const CouponCode = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {discountUser} = useSelector((state: RootState) => state.userDiscount);
    const {user} = useSelector((state: RootState) => state.adminAuth);
    useEffect(() => {
        if(user?.userId){
            dispatch(fetchallUserDiscountCode(user.userId))
        }
    }, [dispatch, user?.userId])
  return (
    <div className='flex gap-4 w-full flex-wrap'>
        {
           discountUser && discountUser.length > 0 && discountUser.map((coupon) => (
                <CouponCard coupon={coupon.discountCode}/>
            ))
        }
    </div>
  )
}

export default CouponCode