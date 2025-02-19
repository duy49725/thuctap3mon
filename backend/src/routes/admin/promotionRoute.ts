import express, {Router} from 'express';
import promotionController from '@controllers/admin/promotionController';

const router: Router = express.Router();

router.get('/get', promotionController.getAllPromotion.bind(promotionController));
router.get('/getById/:id', promotionController.getPromotionById.bind(promotionController));
router.post('/add', promotionController.addPromotion.bind(promotionController));
router.put('/update/:id', promotionController.updatePromotion.bind(promotionController));
router.delete('/delete/:id', promotionController.deletePromotion.bind(promotionController));

export default router;