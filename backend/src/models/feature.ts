import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Feature{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    image!: string;
}