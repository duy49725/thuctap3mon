import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users";
import { DiscountCode } from "./discountCode";
import { CartDetail } from "./cartDetail";

@Entity('carts')
export class Cart {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => DiscountCode, (discount) => discount.cart, {nullable: true})
    @JoinColumn({ name: 'discount_code_id' })
    discount!: DiscountCode;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @OneToMany(() => CartDetail, (cartDetail) => cartDetail.cart, {cascade: true, onDelete: 'CASCADE'})
    cartDetails!: CartDetail[];
}