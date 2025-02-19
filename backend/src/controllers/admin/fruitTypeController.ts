import { AppDataSource } from "@database/data-source";
import { FruitType } from "@models/fruitTypes";
import { Request, Response } from "express";
import { Repository } from "typeorm";

class FruitTypeController{

    private fruitTypeRepository: Repository<FruitType>;

    constructor(){
        this.fruitTypeRepository = AppDataSource.getRepository(FruitType);
    }

    async getAllFruitType(req: Request, res: Response): Promise<void>{
        try{
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const [fruits, totalFruitType] = await this.fruitTypeRepository.findAndCount({
                skip,
                take: limit
            });
            console.log(totalFruitType);
            if(!fruits.length){
                res.status(404).json({
                    success: false,
                    message: 'Fruit Type not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: fruits,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalFruitType/limit),
                    pageSize: limit,
                    totalFruitType
                }
            })
        }catch(error){
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the fruit type',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    async getFruitTypeById(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            const fruitType = await this.fruitTypeRepository.findOne({
                where: {id: Number(id)},
                relations: ['products']
            })
            if(!fruitType){
                res.status(404).json({
                    success: false,
                    message: 'Fruit Type with id not found'
                });
                return; 
            }
            res.status(200).json({
                success: true,
                data: fruitType
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the fruit type',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    async addFruitType(req: Request, res: Response){
        try {
            const {name, description} = req.body;
            const fruitType = await this.fruitTypeRepository.create({name: name, description: description})
            await this.fruitTypeRepository.save(fruitType);
            res.status(200).json({
                success: true,
                data: 'add successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while add the fruit type',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    async updateFruitType(req: Request, res: Response){
        try {
            const {id} = req.params;
            const {name, description} = req.body;
            await this.fruitTypeRepository.update(id, {name, description});
            res.status(200).json({
                success: true,
                data: 'Update successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the fruit type',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    async deleteFruitType(req: Request, res: Response){
        try {
            const {id} = req.params;
            await this.fruitTypeRepository.delete(id);
            res.status(200).json({
                success: true,
                data: 'delete successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the fruit type',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }
}

export default new FruitTypeController();