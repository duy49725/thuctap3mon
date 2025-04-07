import express, {Router} from 'express';
import orderController from '@controllers/admin/orderController';

const router:Router = express.Router();

router.get('/getAllOrder', orderController.getAllOrdersOfAllUser.bind(orderController));
router.get('/getOrderDetail/:id', orderController.getOrderDetailsForAdmin.bind(orderController));
router.put('/updateOrderStatus/:id', orderController.updateOrderStatus.bind(orderController));

export default router;