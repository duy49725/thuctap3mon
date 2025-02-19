import { AppDataSource } from "@database/data-source";
import { Category } from "@models/categories";
import { Request, Response } from "express";
import { Repository } from "typeorm";

class CategoryController{

    private categoryRepository: Repository<Category>;

    constructor(){
        this.categoryRepository = AppDataSource.getRepository(Category);
    }

    async getAllCategory(req: Request, res: Response): Promise<void>{
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const [categories, totalCategories] = await this.categoryRepository.findAndCount({
                skip,
                take: limit
            })
            if(!categories.length){
                res.status(404).json({
                    success: false,
                    message: 'Categories not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: categories,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCategories/limit),
                    pageSize: limit,
                    totalCategories
                }
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the categories'
            })
        }
    }

    async getCategoryById(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            const category = await this.categoryRepository.findOne({
                where: {id: Number(id)},
                relations: ['products']
            })
            if(!category){
                res.status(404).json({
                    success: false,
                    data: 'An error occurred while retrieving category'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: category
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the categories'
            })
        }
    }

    async addCategory(req: Request, res: Response): Promise<void>{
        try {
            const {name, description} = req.body;
            const category = await this.categoryRepository.create({name, description});
            await this.categoryRepository.save(category);
            res.status(200).json({
                success: true,
                data: 'Add category successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the categories'
            })
        }
    }

    async updateCategory(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            const {name, description} = req.body;
            await this.categoryRepository.update(id, {name, description});
            res.status(200).json({
                success: true,
                data: 'Update successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the categories'
            })
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            await this.categoryRepository.delete(id);
            res.status(200).json({
                success: true,
                data: 'delete successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the categories'
            })
        }
    }
}

export default new CategoryController();