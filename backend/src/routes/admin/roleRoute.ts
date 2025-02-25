import express, {Router} from 'express';
import roleController from '@controllers/admin/roleController';
const router: Router = express.Router();

router.get('/get', roleController.getAllRole.bind(roleController));
router.post('/add', roleController.addRole.bind(roleController));
router.put('/update/:id', roleController.updateRole.bind(roleController));
router.delete('/delete/:id', roleController.deleteRole.bind(roleController));

export default router;