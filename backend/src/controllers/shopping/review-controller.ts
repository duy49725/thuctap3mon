import { AppDataSource } from "@database/data-source";
import { Order } from "@models/orders";
import { Product } from "@models/products";
import { ReviewImage } from "@models/reviewImage";
import { ReviewReply } from "@models/reviewReplies";
import { Review } from "@models/reviews";
import { User } from "@models/users";
import { Request, Response } from "express";
import { Repository } from "typeorm";

class ReviewController {

  private orderRepository: Repository<Order>;
  private reviewRepository: Repository<Review>;
  private userRepository: Repository<User>;
  private productReposiory: Repository<Product>;
  private reviewImageRepository: Repository<ReviewImage>;
  private reviewReplyRepository: Repository<ReviewReply>;

  constructor() {
    this.orderRepository = AppDataSource.getRepository(Order);
    this.reviewRepository = AppDataSource.getRepository(Review);
    this.userRepository = AppDataSource.getRepository(User);
    this.productReposiory = AppDataSource.getRepository(Product);
    this.reviewImageRepository = AppDataSource.getRepository(ReviewImage);
    this.reviewReplyRepository = AppDataSource.getRepository(ReviewReply);
  }

  async addReview(req: Request, res: Response): Promise<void> {
    try {
      const { productId, rating, comment, images } = req.body;
      const userId = req.user?.userId;
      const order = await this.orderRepository.find({
        where: { user: { id: userId } }
      })
      console.log(req.body);
      const hasPurchased = await this.orderRepository
        .createQueryBuilder("order")
        .innerJoin("order.orderDetails", "orderDetail")
        .where("order.user_id = :userId", { userId })
        .andWhere("orderDetail.product_id = :productId", { productId })
        .getOne();

      if (!hasPurchased) {
        res.status(403).json({ success: false, message: "You must purchase this product to review" });
        return;
      }
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });
      if (!user) {
        res.status(404).json({
          success: false,
          message: "Invalid data"
        })
        return;
      }
      const product = await this.productReposiory.findOne({
        where: { id: productId }
      })
      const newReview = await this.reviewRepository.create({
        user: user as User,
        product: product as Product,
        rating: rating,
        comment: comment,
        isApproved: false
      })
      await this.reviewRepository.save(newReview);

      if (images && images.length > 0) {
        for (let img of images) {
          const reviewImage = await this.reviewImageRepository.create({
            review: newReview,
            imageUrl: img.imageUrl,
          })
          await this.reviewImageRepository.save(reviewImage);
        }
      }
      res.status(200).json({
        success: true,
        data: "Add review successfully"
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while update the data',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  async getProductReviews(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const [reviews, total] = await this.reviewRepository.findAndCount({
        where: {
          product: { id: parseInt(productId) },
          isApproved: true
        },
        relations: ['user', 'images', 'replies', 'replies.user'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip
      })
      res.status(200).json({
        reviews,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while update the data',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  async approveReview(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const {isApproved} = req.body;
      const review = await this.reviewRepository.findOne({
        where: { id: parseInt(reviewId) }
      });
      if (!review) {
        res.status(404).json({
          success: false,
          message: "Review not found"
        })
        return;
      }
      review.isApproved = isApproved;
      await this.reviewRepository.save(review);
      res.status(200).json({
        success: true,
        message: "Review approved successfully"
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while update the data',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  async getReviewNotAppove(req: Request, res: Response): Promise<void> {
    try {
      const reviews = await this.reviewRepository.find({
        order: {
          createdAt: "DESC",
        },
        relations: ['user', 'product']
      })
      res.status(200).json({
        success: true,
        data: reviews
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while update the data',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  async addReviewReply(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const { replyText } = req.body;
      const userId = req.user?.userId;
      const isSeller = req.user!.roles.some((role: any) => role.roleName === 'seller' || role.roleName === 'admin');
      const review = await this.reviewRepository.findOne({
        where: { id: parseInt(reviewId) }
      })
      if (!review) {
        res.status(200).json({
          success: false,
          message: 'Review not found'
        })
        return;
      }
      const reply = new ReviewReply();
      reply.review = review;
      reply.user = { id: userId } as User;
      reply.replyText = replyText;
      reply.isFromSeller = isSeller;
      const savedReply = await this.reviewReplyRepository.save(reply);
      res.status(200).json({
        success: true,
        message: 'Reply added successfully'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while update the data',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }


}

export default new ReviewController();