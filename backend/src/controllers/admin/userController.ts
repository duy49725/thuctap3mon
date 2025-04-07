import { AppDataSource } from "@database/data-source";
import { UserRole } from "@models/role";
import { User } from "@models/users";
import { Request, Response } from "express";
import { MoreThan, Repository } from "typeorm";
import bcrypt from 'bcryptjs';
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";

class UserController{
    private userRepository: Repository<User>;
    private roleRepository: Repository<UserRole>;

    constructor(){
        this.userRepository = AppDataSource.getRepository(User);
        this.roleRepository = AppDataSource.getRepository(UserRole);
    }

    async getAllUser(req: Request, res: Response): Promise<void>{
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const [users, totalUsers] = await this.userRepository.findAndCount({
                skip,
                take: limit,
                relations: ['roles']
            });
            if(!users.length){
                res.status(404).json({
                    success: false,
                    message: 'Users not found'
                })
                return
            }
            res.status(200).json({
                success: true,
                data: users,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalUsers/limit),
                    pageSize: limit,
                    totalUsers
                }
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the users',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    async addUser(req: Request, res: Response): Promise<void>{
        try {
            const {email, password, fullName, avatar, isVerified, isActive, roles_Id} = req.body;
            const existingUser = await this.userRepository.findOne({
                where: {email: email}
            })
            if(existingUser){
                res.status(200).json({
                    success: false,
                    data: "User already in use"
                })
                return;
            }
            const hashPassword = await bcrypt.hash(password, 12);
            const roles = await Promise.all(
                roles_Id.map((id: any) => this.roleRepository.findOneBy({id}))
            )
            const newUser = await this.userRepository.create({
                email: email, 
                password: hashPassword, 
                fullName: fullName, 
                avatar: avatar, 
                isVerified: isVerified, 
                isActive: isActive, 
                roles: roles
            })
            await this.userRepository.save(newUser);
            res.status(200).json({
                success: true,
                message: 'Add successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while add the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }

    async updateUser(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            let {email, password, fullName, avatar, isVerified, isActive, roles_Id} = req.body;
            const user: any = await this.userRepository.findOneBy({
                id: id
            })
            if(roles_Id){
                const roles = await Promise.all(
                    roles_Id.map((id: any) => this.roleRepository.findOneBy({id: id}))
                )
                user.roles = roles || user.roles;
            }
            const hashPassword = await bcrypt.hash(password, 12);
            user.email = email || user.email;
            user.password = hashPassword || user.password;
            user.fullName = fullName || user.fullName;
            user.avatar = avatar || user.avatar;
            user.isVerified = isVerified;
            user.isActive = isActive;
            await this.userRepository.save(user);
            res.status(200).json({
                success: true,
                data: 'update successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while update the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            await this.userRepository.delete(id);
            res.status(200).json({
                success: true,
                data: 'delete successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while delete the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }
}

export default new UserController();