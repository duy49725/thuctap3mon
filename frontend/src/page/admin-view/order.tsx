import AdminOrderDetail from '@/components/admin-view/order-detail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllOrdersOfAllUser, getOrderDetailsForAdmin, resetOrderDetails } from '@/store/admin/order-slice';
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const AdminOrder = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, orderList, orderDetail } = useSelector((state: RootState) => state.adminOrder);
    const { user } = useSelector((state: RootState) => state.adminAuth);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    useEffect(() => {
        dispatch(getAllOrdersOfAllUser());
    }, [dispatch])

    function handleFetchOrderDetail(id: number) {
        dispatch(getOrderDetailsForAdmin(id));
    }
    useEffect(() => {
        if (orderDetail !== null) setOpenDetailDialog(true);
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
                            orderList && orderList.length > 0
                                ? orderList.map((orderItem) => (
                                    <TableRow>
                                        <TableCell>{orderItem.id}</TableCell>
                                        <TableCell>{new Date(orderItem.orderDate).toISOString().split("T")[0]}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`py-1 px-3 ${orderItem?.status === "processing"
                                                    ? "bg-green-500"
                                                    : orderItem?.status === "cancelled"
                                                        ? "bg-red-600"
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
                    <AdminOrderDetail orderDetail={orderDetail} />
                </Dialog>
            </CardContent>
        </Card>
    )
}

export default AdminOrder