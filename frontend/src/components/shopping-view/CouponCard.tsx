import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DiscountCode } from '@/config/entity';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { applyCouponCode, fetchAllCart } from '@/store/shopping/cart-slice';
import { useToast } from '@/hooks/use-toast';

interface CouponCardProps {
  coupon: DiscountCode;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon }) => {
  const isExpired = new Date(coupon.endDate) < new Date();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.adminAuth);
  const { cartList } = useSelector((state: RootState) => state.userCart);
  const { toast } = useToast();
  return (
    <Card className={`border ${isExpired ? 'border-gray-400' : 'border-green-500'} p-3 rounded-2xl shadow-lg`}>
      <CardHeader>
        <CardTitle className='text-2xl font-bold flex justify-between items-center'>
          {coupon.code}
          <Badge className={coupon.isActive ? 'bg-green-500' : 'bg-red-500'}>
            {coupon.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-1'>
        <p className='text-lg'>Discount: <span className='font-semibold'>${coupon.amount} {coupon.type}</span></p>
        <p>Min Order Value: <span className='font-semibold'>${coupon.minOrderValue}</span></p>
        <p>Usage: <span className='font-semibold'>{coupon.usedCount}/{coupon.maxUser}</span></p>
        <p>Valid: <span className='font-semibold'>{new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}</span></p>
      </CardContent>
      <div className='flex justify-end'>
        <Button
          onClick={async () => {
            try {
              await dispatch(applyCouponCode({ userId: user.userId, discountCode_id: coupon.id })).unwrap();
              await dispatch(fetchAllCart(user.userId));
              toast({
                title: 'Success',
                description: 'Coupon applied successfully!',
              });
            } catch (error: any) {
              toast({
                title: 'Error',
                description: `Your order must be at least ${coupon.minOrderValue} USD`,
                variant: 'destructive'
              });
            }
          }}
          disabled={!coupon.isActive || isExpired}
          className='bg-blue-500 hover:bg-blue-700 text-white'
        >
          Apply Coupon
        </Button>
      </div>
    </Card>
  );
};


export default CouponCard;