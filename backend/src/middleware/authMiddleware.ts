import { AppDataSource } from "@database/data-source";
import { UserRole } from "@models/role";
import { User } from "@models/users";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: UserVerify
        }
    }
}

interface UserVerify {
    userId: string,
    roles: Omit<UserRole, 'id'>[],
    email: string,
    fullName: string,
    avatar: string
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.token;
    console.log(token)
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Unauthorized user"
        })
        return;
    }
    try {
        const decoded = jwt.verify(token, "mySecretKey") as jwt.JwtPayload | null;
        req.user = decoded as UserVerify;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unauthorized user"
        })
    }
}

export default authMiddleware;

export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
       res.status(401).json({ message: 'Authentication required' });
    }
    
    const hasRole = req.user && req.user.roles.some((role: any) => roles.includes(role.roleName));
    
    if (!hasRole) {
       res.status(403).json({ message: 'Access denied' });
    }
    
    next();
  };
}