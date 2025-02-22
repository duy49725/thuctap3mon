import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users";
import { DiscountCode } from "./discountCode";
import { ShippingAddress } from "./shippingAddress";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => DiscountCode, { nullable: true })
    @JoinColumn({ name: 'discountCode_id' })
    discountCode!: DiscountCode;

    @Column('decimal', { precision: 10, scale: 2 })
    subTotal!: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discountAmount!: number;

    @Column({ type: 'enum', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' })
    status!: string;

    @ManyToOne(() => ShippingAddress, { nullable: true })
    @JoinColumn({ name: 'shippingAddress_id' })
    shippingAddress!: ShippingAddress;

    @Column({ length: 50 })
    paymentMethod!: string;

    @CreateDateColumn({ type: 'timestamp' })
    orderDate!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    orderUpdateDate!: Date;

    @Column()
    paymentStatus!: string;
    
    @Column()
    paymentId!: string;

    @Column()
    payerId!: string;
}