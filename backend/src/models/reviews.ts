import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./products";
import { User } from "./users";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product!: Product

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column()
    rating!: number;

    @Column('text')
    comment!: string;
    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

}