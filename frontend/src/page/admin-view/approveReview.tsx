import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { approveReview, fetchDontApproveReview } from '@/store/shopping/review-slice';
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const AdminApproveReview = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {reviews} = useSelector((state: RootState) => state.userReview.reviewDontApprove);
    useEffect(() => {
        dispatch(fetchDontApproveReview());
    }, [dispatch])
    console.log(reviews);
    const handleToggleApprove = (reviewId: number, isApproved: boolean | "indeterminate") => {
        if (isApproved !== "indeterminate") { 
            dispatch(approveReview({ reviewId: reviewId, isApproved: isApproved as boolean }))
                .then(() => dispatch(fetchDontApproveReview()));
        }
    };
  return (
    <div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>id</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Approve</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    reviews.map((review) => (
                        <TableRow>
                            <TableCell>{review.id}</TableCell>
                            <TableCell>{review.user.fullName}</TableCell>
                            <TableCell>{review.product.name}</TableCell>
                            <TableCell>{review.rating}</TableCell>
                            <TableCell>{review.comment}</TableCell>
                            <TableCell>{new Date(review.createdAt).toISOString().split('T')[0]}</TableCell>
                            <TableCell>
                                <Checkbox 
                                    checked={review.isApproved}
                                    onCheckedChange={(checked) => handleToggleApprove(review.id, checked)}
                                />
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </div>
  )
}

export default AdminApproveReview