import { Router } from 'express';
import fileUpload from '@controllers/common/file-upload';
import authMiddleware from 'src/middleware/authMiddleware';
const router = Router();

router.post(
  '/upload-single', 
  authMiddleware, 
  fileUpload.uploadSingleImage, 
  fileUpload.uploadImageToCloudinary
);

router.post(
  '/upload-multiple', 
  authMiddleware, 
  fileUpload.uploadMultipleImages, 
  fileUpload.uploadMultipleImagesToCloudinary
);

export default router;