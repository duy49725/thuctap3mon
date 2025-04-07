import express, {Router} from 'express';
import productController from '@controllers/admin/productController';
import {upload} from 'src/helpers/cloudinary';
const router:Router = express.Router();


router.post('/upload-image', upload.single('image'), productController.handleImageUpload.bind(productController));
router.get('/get', productController.getAllProduct.bind(productController));
router.get('/getById/:id', productController.getProductById.bind(productController));
router.post('/add', productController.addProduct.bind(productController));
router.put('/update/:id', productController.updateProduct.bind(productController));
router.delete('/delete/:id', productController.deleteProduct.bind(productController));
router.get('/getProductImage', productController.getAllProductImages.bind(productController));
export default router;