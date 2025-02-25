import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users";

@Entity()
export class ShippingAddress {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ length: 255 })
    fullName!: string

    @Column('text')
    streetAddress!: string;

    @Column({ length: 100 })
    city!: string;

    @Column({ length: 100, nullable: true })
    state!: string;

    @Column({ length: 20 })
    postal_code!: string;

    @Column({ length: 100, default: 'Vietnam' })
    country!: string;

    @Column({ default: false })
    is_default!: boolean;

    @Column()
    phoneNumber!: number;

    @Column()
    note!: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;
}