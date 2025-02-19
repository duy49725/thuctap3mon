import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { FruitType } from "./fruitTypes";
import { Category } from "./categories";
import { Promotion } from "./promotions";
import { CartDetail } from "./cartDetail";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'nvarchar', length: 255 })
    name!: string;

    @ManyToOne(() => FruitType, (fruitType) => fruitType.products)
    @JoinColumn({ name: 'fruitType_id' })
    fruitType!: FruitType;

    @Column({ type: 'nvarchar', length: 255 })
    description!: string;

    @Column({ type: 'decimal' })
    price!: number;

    @Column({ type: 'int' })
    quantity!: number;

    @Column({ type: 'nvarchar', length: 255 })
    unit!: string;

    @Column({ type: 'nvarchar', length: 255 })
    image!: string;

    @Column({ type: 'boolean' })
    isActive!: boolean;

    @ManyToMany(() => Category, (category) => category.products)
    @JoinTable({
        name: 'product_category',
        joinColumn: { name: 'product_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
    })
    categories!: Category[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    @ManyToMany(() => Promotion, (promotion) => promotion.products)
    @JoinTable({
        name: 'product_promotion',
        joinColumn: {name: 'product_id', referencedColumnName: 'id'},
        inverseJoinColumn: {name: 'promotion_id', referencedColumnName: 'id'}
    })
    promotions!: Promotion[];

    @OneToMany(() => CartDetail, (cartDetail) => cartDetail.product)
    cartDetails!: CartDetail[];
}