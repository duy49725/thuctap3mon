import express, {Router} from 'express';
import discountCodeController from '@controllers/shopping/discountCode-controller';

const router: Router = express.Router();

router.get('/getDiscountUser/:userId', discountCodeController.getAllDiscountCodeByUser.bind(discountCodeController));
router.get('/getAll', discountCodeController.getAllDiscountCode.bind(discountCodeController));
router.post('/spinningWheel/:userId/:discountId', discountCodeController.createSpinningResult.bind(discountCodeController));

export default router;
