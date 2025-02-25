import express, {Router} from 'express';
import orderController from '@controllers/shopping/order-controller';

const router: Router = express.Router();

router.post('/create', orderController.createOrder.bind(orderController));
router.post('/capture', orderController.capturePayment.bind(orderController));
router.get('/list/:userId', orderController.getAllOrderOfUser.bind(orderController));
router.get('/detail/:id', orderController.getAllOrderOfUser.bind(orderController));

export default router;