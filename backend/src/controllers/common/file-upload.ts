import { Request, Response } from "express";
import { upload } from "src/helpers/cloudinary";
import { v2 as cloudinary } from 'cloudinary';

class FileUploadController{
    uploadSingleImage = upload.single('image');
    uploadMultipleImages = upload.array('images', 5);

    async uploadImageToCloudinary(req: Request, res: Response): Promise<void>{
        try {
            if(!req.file){
                res.status(400).json({
                    success: false,
                    message: 'No image uploaded'
                });
                return;
            }
            const base64Image = req.file.buffer.toString('base64');
            const dataURI = `data: ${req.file.mimetype};base64,${base64Image}`;
            const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
                folder: 'review_images',
                resource_type: 'auto'
            })
            res.status(200).json({
                success: true,
                data: {
                    imageUrl: cloudinaryResponse.secure_url,
                    publicId: cloudinaryResponse.public_id
                }
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Failed to upload image',
                error: error instanceof Error ? error.message : 'Unknown error'
              });
        }
    }

    async uploadMultipleImagesToCloudinary(req: Request, res: Response): Promise<void>{
        try {
            if(!req.files || (req.files as Express.Multer.File[]).length === 0){
                res.status(400).json({
                    success: false,
                    message: 'No images uploaded'
                });
                return;
            }
            const uploadPromises = (req.files as Express.Multer.File[]).map(async (file) => {
                const base64Image = file.buffer.toString('base64');
                const dataURI = `data:${file.mimetype};base64,${base64Image}`;
                return cloudinary.uploader.upload(dataURI, {
                    folder: 'review_images',
                    resource_type: 'auto'
                });
            })
            const cloudinaryResponse = await Promise.all(uploadPromises);
            const uploadedImages = cloudinaryResponse.map(response => ({
                imageUrl: response.secure_url,
                publicId: response.public_id
            }))
            res.status(200).json({
                success: true,
                data: uploadedImages
              });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Failed to upload images',
                error: error instanceof Error ? error.message : 'Unknown error'
              });
        }
    }
}

export default new FileUploadController();