import express, {Router} from 'express';
import userController from '@controllers/admin/userController';

const router: Router = express.Router();

router.get('/get', userController.getAllUser.bind(userController));
router.post('/add', userController.addUser.bind(userController));
router.put('/update/:id', userController.updateUser.bind(userController));
router.delete('/delete/:id', userController.deleteUser.bind(userController));

export default router;