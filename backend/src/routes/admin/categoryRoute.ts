import express, {Router} from 'express';
import categoryController from '@controllers/admin/categoryController';

const router: Router = express.Router();

router.get('/get', categoryController.getAllCategory.bind(categoryController));
router.get('/getById/:id', categoryController.getCategoryById.bind(categoryController));
router.post('/add', categoryController.addCategory.bind(categoryController));
router.put('/update/:id', categoryController.updateCategory.bind(categoryController));
router.delete('/delete/:id', categoryController.deleteCategory.bind(categoryController));

export default router;