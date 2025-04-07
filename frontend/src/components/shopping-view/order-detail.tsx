import { userOrderResponse } from '@/config/entity'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'

interface shoppingOrderDetailViewProps{
    orderDetail: userOrderResponse
}

const ShoppingOrderDetailView = ({orderDetail}: shoppingOrderDetailViewProps) => {
  return (
    <DialogContent className='sm:max-w-[600px]'>
        <div className='grid gap-6 mt-3'>
            <div className='grid gap-2'>
                <div className='flex mt-2 items-center justify-between'>
                    <p>Order Id</p>
                    <Label>{orderDetail?.id}</Label>
                </div>
                <div className='flex items-center justify-between '>
                    <div className='flex mt-2 items-center gap-2'>
                        <p>SubTotal: </p>
                        <Label>{orderDetail?.subTotal}</Label>
                    </div>
                    <div className='flex mt-2 items-center gap-2'>
                        <p>Discount Amount: </p>
                        <Label>{orderDetail?.discountAmount}</Label>
                    </div>
                    <div className='flex mt-2 items-center gap-2'>
                        <p>Total Amount: </p>
                        <Label>{orderDetail?.totalAmount}</Label>
                    </div>
                </div>
                <div className='flex mt-2 items-center justify-between'>
                    <p>Payment Method</p>
                    <Label>{orderDetail?.paymentMethod}</Label>
                </div>
                <div className='flex mt-2 items-center justify-between'>
                    <p>Payment Status</p>
                    <Label>{orderDetail?.paymentStatus}</Label>
                </div>
                <div className='flex mt-2 items-center justify-between'>
                    <p>Order Status</p>
                    <Label>
                        <Badge
                            className={`py-1 px-3 ${orderDetail?.status === "confirmed"
                                    ? "bg-green-500" 
                                    : orderDetail?.status === "rejected"
                                        ? "bg-red-600"
                                        : "bg-black"
                            }`}
                        >
                            {orderDetail?.status}
                        </Badge>
                    </Label>
                </div>
            </div>
            <Separator />
            <div className='grid gap-4'>
                <div className='grid gap-2'>
                    <div className='font-medium'>Order Details</div>
                    <ul className='grid gap-3'>
                        {
                            orderDetail?.orderDetails.map((item) => (
                               <div className='flex justify-between items-center'>
                                 <p>Product name: {item?.product.name}</p>
                                 <img className='w-[69px]' src={item?.product.image} alt="" />
                                 <p>Product Quantity: {item?.quantity}</p>
                                 <p>Product UnitPrice: {item?.unitPrice}</p>
                               </div>
                            ))
                        }
                    </ul>
                </div>
            </div>
            <Separator />
            <div className='grid gap-4'>
                <div className='grid gap-2'>
                    <div className='font-medium'>Shipping Info</div>
                    <ul className='grid gap-3'> 
                        <li className='grid gap-0.5 text-muted-foreground'>
                            <p className='text-slate-900'>Full Name:  <span className='text-slate-600'>{orderDetail?.user?.fullName}</span></p>
                            <p className='text-slate-900'>Address: <span className='text-slate-600'>{` ${orderDetail?.shippingAddress?.streetAddress} - ${orderDetail?.shippingAddress?.state} ${orderDetail?.shippingAddress?.city} - ${orderDetail?.shippingAddress?.country}`}</span></p>
                            <p className='text-slate-900'>Postal Code: <span className='text-slate-600'>{orderDetail?.shippingAddress?.postal_code}</span></p>
                            <p className='text-slate-900'>Phone: <span className='text-slate-600'>{orderDetail?.shippingAddress?.phoneNumber}</span></p>
                            <p className='text-slate-900'>Note: <span className='text-slate-600'>{orderDetail?.shippingAddress?.note}</span></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </DialogContent>
  )
}

export default ShoppingOrderDetailView