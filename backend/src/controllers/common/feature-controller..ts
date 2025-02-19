import { AppDataSource } from "@database/data-source";
import { Feature } from "@models/feature";
import { Request, Response } from "express";
import { Repository } from "typeorm";

class FeatureController{

    featureRepository: Repository<Feature>;

    constructor(){
        this.featureRepository = AppDataSource.getRepository(Feature);
    }

    async getAllFeatureImage(req: Request, res: Response): Promise<void>{
        try {
            const allFeatureImage = await this.featureRepository.find({});
            res.status(200).json({
                succcess: true,
                data: allFeatureImage
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the data',
                error: error instanceof Error ? error.message : 'Unknown error',
            })
        }
    }

    /*async uploadImage(file: Express.Multer.File): Promise<string>{
        const image = file;
        const base64Image = Buffer.from(image.buffer).toString("base64");
        const datauri = `data:${image.mimetype};base64,${base64Image}`;
        const uploadResponse = await cloudinary.v2.uploader.upload(datauri);
        return uploadResponse.url
    }*/

    async addFeatureImage(req: Request, res: Response): Promise<void>{
        try {
            let {image} = req.body;
            //const imageUrl = await this.uploadImage(req.file as Express.Multer.File);
            //image = imageUrl;
            console.log(image)
            const featureImage = await this.featureRepository.create({image});
            await this.featureRepository.save(featureImage);
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

    async deleteFeatureImage(req: Request, res: Response): Promise<void>{
        try {
            const {id} = req.params;
            await this.featureRepository.delete(id);
            res.status(200).json({
                success: true,
                data: "delete successfully"
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

export default new FeatureController();