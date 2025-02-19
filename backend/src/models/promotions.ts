import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./products";

@Entity('Promotions')
export class Promotion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'nvarchar', length: 255 })
    name!: string;

    @Column({ type: 'nvarchar', length: 255 })
    description!: string;

    @Column({ type: 'decimal' })
    discountAmount!: number;

    @Column({ type: 'nvarchar' })
    discountType!: string;

    @Column({ type: 'datetime' })
    startDate!: Date;

    @Column({ type: 'datetime' })
    endDate!: Date;

    @Column({ type: 'boolean' })
    isActive!: boolean;

    @ManyToMany(() => Product, (product) => product.promotions)
    products!: Product[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;
}