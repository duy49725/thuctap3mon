import { fetchProductReviews } from '@/store/shopping/review-slice';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '../ui/avatar';
import StarRatingComponent from '@/common/star-rating';
import { Separator } from '../ui/separator';

const ReviewProduct = ({ productId }: { productId: number | undefined }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [limit, setLimit] = useState<number>(10);
    const { loading, error, reviews, pagination } = useSelector((state: RootState) => state.userReview.productReviews);
    useEffect(() => {
        dispatch(fetchProductReviews({ productId, page: 1, limit: limit }))
    }, [productId, limit])
    console.log(reviews);
    return (
        <div className='flex flex-col gap-4 w-full'>
            {
                reviews.map((review) => (
                    <div>
                        <div className='flex gap-2 items-center justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Avatar>
                                    <img src={review?.user?.avatar} />
                                </Avatar>
                                {review.user.fullName}
                            </div>
                            <p> {new Date(review.createdAt).toISOString().split('T')[0]}</p>
                        </div>
                        <p><StarRatingComponent rating={review.rating} /></p>
                        <p className='mb-2'>{review.comment}</p>
                        <div className='flex gap-2'>
                            {
                                review.images.map((image) => (
                                    <img className="h-24 w-24 object-cover rounded-md mb-3"
                                        src={image.imageUrl} alt="" />
                                ))
                            }
                        </div>
                        <Separator />
                    </div>

                ))
            }
            <p
                className='cursor-pointer text-center'
                onClick={() => setLimit((prev) => prev + 5)}
            >show more</p>
        </div>
    )
}

export default ReviewProduct;