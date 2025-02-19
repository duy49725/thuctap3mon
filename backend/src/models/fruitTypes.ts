import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./products";

@Entity('fruitTypes')
export class FruitType{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'nvarchar', length: 255})
    name!: string;

    @Column({type: 'nvarchar', length: 255})
    description!: string;

    @OneToMany(() => Product, (product) => product.fruitType)
    products!: Product[];

    @CreateDateColumn({type: 'timestamp'})
    createdAt!: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt!: Date;
}