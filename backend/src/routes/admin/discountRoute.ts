import express, {Router} from 'express';
import discountCodeController from '@controllers/admin/discountCodeController';

const router: Router = express.Router();

router.get('/get', discountCodeController.getAllDiscountCode.bind(discountCodeController));
router.post('/add', discountCodeController.createDiscountCode.bind(discountCodeController));
router.put('/update/:id', discountCodeController.updateDiscountCode.bind(discountCodeController));
router.delete('/delete/:id', discountCodeController.deleteDiscountCode.bind(discountCodeController));

export default router;