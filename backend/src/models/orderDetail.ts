import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./orders";
import { Product } from "./products";

@Entity()
export class OrderDetail {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order!: Order;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    @Column()
    quantity!: number;
    
    @Column()
    unitPrice!: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}