import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DiscountCode } from '@/config/entity';

interface CouponCardProps {
  coupon: DiscountCode;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon }) => {
  const isExpired = new Date(coupon.endDate) < new Date();

  return (
    <Card className={`border ${isExpired ? 'border-gray-400' : 'border-green-500'} p-4 rounded-2xl shadow-lg`}>
      <CardHeader>
        <CardTitle className='text-2xl font-bold flex justify-between items-center'>
          {coupon.code}
          <Badge className={coupon.isActive ? 'bg-green-500' : 'bg-red-500'}>
            {coupon.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <p className='text-lg'>Discount: <span className='font-semibold'>${coupon.amount} {coupon.type}</span></p>
        <p>Min Order Value: <span className='font-semibold'>${coupon.minOrderValue}</span></p>
        <p>Usage: <span className='font-semibold'>{coupon.usedCount}/{coupon.maxUser}</span></p>
        <p>Valid: <span className='font-semibold'>{new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}</span></p>
      </CardContent>
      <div className='mt-4 flex justify-end'>
        <Button disabled={!coupon.isActive || isExpired} className='bg-blue-500 hover:bg-blue-700 text-white'>
          Apply Coupon
        </Button>
      </div>
    </Card>
  );
};


export default CouponCard;