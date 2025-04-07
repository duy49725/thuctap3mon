import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./products";

@Entity('product_review_stats')
export class ReviewStatistic{
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Product, product => product.reviewStats, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name: 'product_id'})
    product!: Product;

    @Column({type: 'decimal', precision: 3, scale: 2, default: 0})
    avgRating!: number;

    @Column({default: 0})
    totalReviews!: number;

    @Column({default: 0})
    fiveStarCount!: number;

    @Column({default: 0})
    fourStarCount!: number;

    @Column({default: 0})
    threeStarCount!: number;

    @Column({default: 0})
    twoStarCount!: number;

    @Column({default: 0})
    oneStarCount!: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}