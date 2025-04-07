import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToOne, OneToMany } from "typeorm";
import { UserRole } from "./role";
import { Review } from "./reviews";
import { ReviewReply } from "./reviewReplies";

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

    @OneToMany(() => Review, (review) => review.user)
    reviews!: Review[];

    @OneToMany(() => ReviewReply, (reply) => reply.user)
    reviewReplies!: ReviewReply[];

    @Column({ type: "varchar", length: 255, nullable: true })
    resetPasswordToken!: string | null;

    @Column({ type: "timestamp", nullable: true })
    resetPasswordExpires!: Date | null;
}