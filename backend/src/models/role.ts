import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users";

@Entity()
export class UserRole{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    roleName!: string;

    @ManyToMany(() => User, (user) => user.roles)
    users!: User[];
}