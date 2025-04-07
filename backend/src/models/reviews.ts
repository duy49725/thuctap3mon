import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Check, OneToMany, OneToOne } from "typeorm";
import { Product } from "./products";
import { User } from "./users";
import { OrderDetail } from "./orderDetail";
import { ReviewReply } from "./reviewReplies";
import { ReviewImage } from "./reviewImage";

@Entity("reviews")
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.reviews, {nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({name: 'user_id'})
    user!: User;

    @ManyToOne(() => Product, product => product.reviews, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'product_id'})
    product!: Product;

    @Column()
    @Check('rating >= 1 AND rating <= 5')
    rating!: number;

    @Column({type: 'text'})
    comment!: string;

    @Column({default: false})
    isApproved!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @OneToMany(() => ReviewReply, (reply) => reply.review, {cascade: true})
    replies!: ReviewReply[];

    @OneToMany(() => ReviewImage, (image) => image.review, {cascade: true})
    images!: ReviewImage[];
}