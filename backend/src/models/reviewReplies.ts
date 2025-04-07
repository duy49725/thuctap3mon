import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Review } from "./reviews";
import { User } from "./users";

@Entity('review_replies')
export class ReviewReply{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Review, (review) => review.replies, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'review_id'})
    review!: Review;

    @ManyToOne(() => User, user => user.reviewReplies, {nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({name: 'user_id'})
    user!: User;

    @Column({type: 'text'})
    replyText!: string;

    @Column({default: false})
    isFromSeller!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}