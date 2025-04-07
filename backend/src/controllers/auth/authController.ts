import { User } from "@models/users"
import { UserRole } from "@models/role"
import { MoreThan, Repository } from "typeorm"
import { AppDataSource } from "@database/data-source";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserCoupon } from "@models/userDiscount";
import { DiscountCode } from "@models/discountCode";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";

class AuthController {
    userRepository: Repository<User>;
    userRoleRepository: Repository<UserRole>;
    userDiscountRepository: Repository<UserCoupon>;
    discountCodeRepository: Repository<DiscountCode>;
    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.userRoleRepository = AppDataSource.getRepository(UserRole);
        this.userDiscountRepository = AppDataSource.getRepository(UserCoupon);
        this.discountCodeRepository = AppDataSource.getRepository(DiscountCode);
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
            const activeDiscounts = await this.discountCodeRepository.find({
                where: { isActive: true }
            });
            if (activeDiscounts.length > 0) {
                const randomDiscount = activeDiscounts[Math.floor(Math.random() * activeDiscounts.length)];
                console.log(randomDiscount)
                const userCoupon = await this.userDiscountRepository.create({
                    user: newUser,
                    discountCode: randomDiscount,
                    usedAt: undefined
                });
                console.log(userCoupon);
                await this.userDiscountRepository.save(userCoupon);
            }
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
            if (!user.isActive) {
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

    async CheckAuth(req: Request, res: Response): Promise<void> {
        const user = req.user;
        res.status(200).json({
            success: true,
            message: 'Authenticated user!',
            user
        })
    }

    async LoginGoogle(req: Request, res: Response): Promise<void> {
        const { email, fullName, avatar } = req.body;
        try {
            const user = await this.userRepository.findOne({
                where: { email },
                relations: ['roles']
            })
            if (user) {
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
            } else {
                const generatedPassword = Math.random().toString(36).slice(-8) +
                    Math.random().toString(36).slice(-8);
                const hashPassword = bcrypt.hashSync(generatedPassword, 12);
                const newUser = await this.userRepository.create({ email: email, password: hashPassword, fullName: fullName, avatar: avatar });
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
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while add the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        const user = await this.userRepository.findOne({
            where: { email }
        });
        if (!user) {
            res.status(404).json({ message: "Email không tồn tại" });
            return;
        }
        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await this.userRepository.save(user);
        const transporter = nodemailer.createTransport({
            secure: true,
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: 'duy49725@gmail.com',
                pass: 'izlqmoxhcquoruot',
            },
        })
        const resetUrl = `http://localhost:5173/auth/${token}`;
        const mailOptions = {
            to: user.email,
            from: 'duy49725@gmail.com',
            subject: 'Reset Password',
            text: `Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào liên kết sau để đặt lại: ${resetUrl}\nLiên kết này sẽ hết hạn sau 1 giờ.`
        }
        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi" });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi khi gửi email" });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        const { token, newPassword } = req.body;
        console.log(req.body);
        const user = await this.userRepository.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: MoreThan(new Date())
            }
        });
        if (!user) {
            res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.userRepository.save(user);

        res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
    }
}

export default new AuthController();