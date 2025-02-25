import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users";
import { DiscountCode } from "./discountCode";

@Entity('userCoupons')
export class UserCoupon {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.id)
    user!: User;

    @ManyToOne(() => DiscountCode, (discountCode) => discountCode.id)
    discountCode!: DiscountCode;

    @Column({ type: 'datetime' })
    usedAt!: Date;
}