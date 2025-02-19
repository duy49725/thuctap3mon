import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./carts";


@Entity('discountCodes')
export class DiscountCode {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 59 })
    code!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount!: number;

    @Column({ type: 'nvarchar', length: 50 })
    type!: string;

    @Column({ type: 'decimal' })
    minOrderValue!: number;

    @Column({ type: 'int' })
    maxUser!: number;

    @Column({ type: 'int' })
    usedCount!: number;

    @Column({ type: 'datetime' })
    startDate!: Date;

    @Column({ type: 'datetime' })
    endDate!: Date;

    @Column({ type: 'boolean' })
    isActive!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    @OneToMany(() => Cart, (cart) => cart.discount)
    cart!: Cart[]
}