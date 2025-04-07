import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./products";

@Entity()
export class ProductImage{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Product, (product) => product.productImages)
    @JoinColumn({name: 'product_Id'})
    product!: Product;

    @Column()
    image!: string;
}