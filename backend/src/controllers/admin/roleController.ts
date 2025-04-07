import { AppDataSource } from "@database/data-source";
import { UserRole } from "@models/role";
import { Request, Response } from "express";
import { Repository } from "typeorm";

class RoleController{
    private roleRepository: Repository<UserRole>;
    constructor(){
        this.roleRepository = AppDataSource.getRepository(UserRole);
    }
    async getAllRole(req: Request, res: Response): Promise<void>{
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const [roles, totalRoles] = await this.roleRepository.findAndCount({
                skip,
                take: limit
            })
            if(!roles.length){
                res.status(404).json({
                    success: false,
                    message: 'UserRole not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: roles,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalRoles/limit),
                    pageSize: limit,
                    totalRoles
                }
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the roles',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    async addRole(req: Request, res: Response): Promise<void>{
        try {
            const {roleName} = req.body;
            const role = await this.roleRepository.create({roleName});
            await this.roleRepository.save(role);
            res.status(200).json({
                success: true,
                data: 'Add role successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while adding the role',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    async updateRole(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const {roleName} = req.body;
            await this.roleRepository.update(id, {roleName});
            res.status(200).json({
                success: true,
                data: 'Update successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating the role',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    async deleteRole(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            await this.roleRepository.delete(id);
            res.status(200).json({
                success: true,
                data: 'delete successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while deleting the categories'
            })
        }
    }
}

export default new RoleController();