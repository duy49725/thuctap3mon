import { getAllOrderByUser, getOrderById, resetOrderDetails } from '@/store/shopping/order-slice';
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog } from '../ui/dialog';
import ShoppingOrderDetailView from './order-detail';

const ShoppingOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userOrderList, orderDetail } = useSelector((state: RootState) => state.shopOrder);
  const { user } = useSelector((state: RootState) => state.adminAuth);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  useEffect(() => {
    if (user.userId) {
      dispatch(getAllOrderByUser(user?.userId));
    }
  }, [dispatch, user?.userId]);
  function handleFetchOrderDetail(getId: number){
    dispatch(getOrderById(getId));
  }
  useEffect(() => {
    if(orderDetail !== null) setOpenDetailDialog(true);
  }, [orderDetail])
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Order History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Id</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Prices</TableHead>
              <TableHead>
                <span className='sr-only'>Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              userOrderList && userOrderList.length > 0
                ? userOrderList.map((orderItem) => (
                  <TableRow>
                    <TableCell>{orderItem.id}</TableCell>
                    <TableCell>{new Date(orderItem?.orderDate).toISOString().split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem.status === "confirmed"
                          ? "bg-green-500"
                          : orderItem.status === "rejected"
                          ? "bg-red-500"
                          : "bg-black"
                        }`}
                      >
                         {orderItem.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{orderItem.totalAmount}</TableCell>
                    <TableCell>
                      <Button
                          onClick={() => {
                            handleFetchOrderDetail(orderItem.id)
                          }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
                : null
            }
          </TableBody>
        </Table>
        <Dialog
          open={openDetailDialog}
          onOpenChange={() => {
            setOpenDetailDialog(false)
            dispatch(resetOrderDetails())
          }}
        >
          <ShoppingOrderDetailView orderDetail={orderDetail} />
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default ShoppingOrders