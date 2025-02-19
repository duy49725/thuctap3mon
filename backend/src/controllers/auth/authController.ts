import { User } from "@models/users"
import { UserRole } from "@models/role"
import { Repository } from "typeorm"
import { AppDataSource } from "@database/data-source";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthController {
    userRepository: Repository<User>;
    userRoleRepository: Repository<UserRole>;
    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.userRoleRepository = AppDataSource.getRepository(UserRole);
    }

    async Register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, fullName } = req.body;
            const existingUser = await this.userRepository.findOne({
                where: { email: email }
            })
            if (existingUser) {
                res.status(200).json({
                    success: false,
                    data: "User already in use"
                })
                return;
            }
            const hashPassword = await bcrypt.hash(password, 12);
            const userRoles = await this.userRoleRepository.findOne({
                where: { roleName: "user" }
            })
            const newUser = await this.userRepository.create({
                email: email,
                password: hashPassword,
                fullName: fullName,
                isActive: true,
                isVerified: true,
            })
            if (userRoles) {
                newUser.roles = [userRoles]
            }
            await this.userRepository.save(newUser);
            res.status(200).json({
                success: true,
                message: "Register successfully"
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while add the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }

    async Login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const user = await this.userRepository.findOne({
                where: { email: email },
                relations: ['roles']
            })
            if (!user) {
                res.status(404).json({
                    success: false,
                    data: "User doesn't existing"
                })
                return;
            }
            if(!user.isActive){
                res.status(404).json({
                    success: false,
                    data: "User is banned"
                })
                return;
            }
            const hashPassword = await bcrypt.compare(password, user.password);
            if (!hashPassword) {
                res.status(400).json({
                    success: false,
                    data: "Password doesn't match"
                })
                return;
            }
            const token = jwt.sign({
                userId: user.id,
                roles: user.roles.map(role => role.roleName),
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar
            },
                'mySecretKey',
                { expiresIn: '1h' }
            )
            res.cookie('token', token, { httpOnly: true, secure: false }).json({
                success: true,
                data: "user login successfully",
                user: {
                    userId: user.id,
                    roles: user.roles.map(role => role.roleName),
                    email: user.email,
                    fullName: user.fullName,
                    avatar: user.avatar
                }
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while add the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }

    async Logout(req: Request, res: Response): Promise<void> {
        res.clearCookie('token').json({
            success: true,
            message: "Logged out successfully"
        })
    }

    async CheckAuth(req: Request, res: Response): Promise<void>{
        const user = req.user;
        res.status(200).json({
            success: true,
            message: 'Authenticated user!',
            user
        })
    }

    async LoginGoogle(req: Request, res: Response): Promise<void>{
        const {email, fullName, avatar} = req.body;
        try{
            const user = await this.userRepository.findOne({
                where: {email}
            })
            if(user){
                const token = jwt.sign({
                    userId: user.id,
                    roles: user.roles.map(role => role.roleName),
                    email: user.email,
                    fullName: user.fullName,
                    avatar: user.avatar
                },
                    'mySecretKey',
                    { expiresIn: '1h' }
                )
                res.cookie('token', token, { httpOnly: true, secure: false }).json({
                    success: true,
                    data: "user login successfully",
                    user: {
                        userId: user.id,
                        roles: user.roles.map(role => role.roleName),
                        email: user.email,
                        fullName: user.fullName,
                        avatar: user.avatar
                    }
                })
            }else{
                const generatedPassword = Math.random().toString(36).slice(-8) + 
                                          Math.random().toString(36).slice(-8);
                const hashPassword = bcrypt.hashSync(generatedPassword, 12);
                const newUser = await this.userRepository.create({email: email, password: hashPassword, fullName: fullName, avatar: avatar});
                await this.userRepository.save(newUser);
                const token = jwt.sign({
                    userId: newUser.id,
                    roles: newUser.roles.map(role => role.roleName),
                    email: newUser.email,
                    fullName: newUser.fullName,
                    avatar: newUser.avatar
                },
                    'mySecretKey',
                    { expiresIn: '1h' }
                )
                res.cookie('token', token, { httpOnly: true, secure: false }).json({
                    success: true,
                    data: "user login successfully",
                    user: {
                        userId: newUser.id,
                        roles: newUser.roles.map(role => role.roleName),
                        email: newUser.email,
                        fullName: newUser.fullName,
                        avatar: newUser.avatar
                    }
                })
            }
        }catch(error){
            res.status(500).json({
                success: false,
                message: 'An error occurred while add the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }
}

export default new AuthController();