import express, {Router} from 'express'
import shippingAddressController from '@controllers/shopping/address-controller';

const router: Router = express.Router();

router.get('/get/:userId', shippingAddressController.getAllShippingAddress.bind(shippingAddressController));
router.post('/add', shippingAddressController.createShippingAddress.bind(shippingAddressController));
router.put('/update/:id/:userId', shippingAddressController.updateShippingAddress.bind(shippingAddressController));
router.delete('/delete/:id', shippingAddressController.deleteShippingAddress.bind(shippingAddressController));

export default router;