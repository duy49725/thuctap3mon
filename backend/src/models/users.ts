import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToOne } from "typeorm";
import { UserRole } from "./role";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ nullable: true })
    fullName!: string;

    @Column({ nullable: true })
    avatar!: string;

    @Column({ default: false })
    isVerified!: boolean;

    @Column({ default: true })
    isActive!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @ManyToMany(() => UserRole, (role) => role.users)
    @JoinTable()
    roles!: UserRole[];
}