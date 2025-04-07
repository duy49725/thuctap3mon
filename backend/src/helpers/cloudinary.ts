import {v2 as cloudinary} from "cloudinary";
import multer from 'multer';
import path from "path";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedFileTypes.test(file.mimetype);
        if(extname && mimetype){
            return cb(null, true)
        }
        cb(new Error('Invalid file type. Only image are allowed'))
    }
})

export async function imageUploadUtil(file: string) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: "auto"
    })
    return result;
}

