import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./carts";
import { Product } from "./products";

@Entity('cartDetails')
export class CartDetail {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    quantity!: number;

    @Column()
    unitPrice!: number;

    @ManyToOne(() => Product, product => product.cartDetails)
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    @ManyToOne(() => Cart, cart => cart.cartDetails)
    @JoinColumn({ name: 'cart_id' })
    cart!: Cart;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}