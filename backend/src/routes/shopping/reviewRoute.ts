import { Router } from 'express';
import reviewController from '@controllers/shopping/review-controller';
import authMiddleware from 'src/middleware/authMiddleware';

const router = Router();

router.post('/add',authMiddleware, reviewController.addReview.bind(reviewController));
router.get('/get/:productId', reviewController.getProductReviews.bind(reviewController));
router.patch('/approve/:reviewId',authMiddleware, reviewController.approveReview.bind(reviewController));
router.post('/addReply/:reviewId',authMiddleware, reviewController.addReviewReply.bind(reviewController));
router.get('/getReviewNotApprove', reviewController.getReviewNotAppove.bind(reviewController));
export default router;
