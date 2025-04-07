import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Review } from "./reviews";

@Entity('review_images')
export class ReviewImage{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Review, (review) => review.images, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name: 'review_id'})
    review!: Review;

    @Column({type: 'varchar', length: 255})
    imageUrl!: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}