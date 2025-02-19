import express, {Router} from 'express';
import fruitTypeController from '@controllers/admin/fruitTypeController';

const router: Router = express.Router();

router.get('/get', fruitTypeController.getAllFruitType.bind(fruitTypeController));
router.get('/getById/:id', fruitTypeController.getFruitTypeById.bind(fruitTypeController));
router.post('/add', fruitTypeController.addFruitType.bind(fruitTypeController));
router.put('/update/:id', fruitTypeController.updateFruitType.bind(fruitTypeController));
router.delete('/delete/:id', fruitTypeController.deleteFruitType.bind(fruitTypeController));

export default router;