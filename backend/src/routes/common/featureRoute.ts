import express, {Router} from 'express';
import featureController from '@controllers/common/feature-controller.';

const router:Router = express.Router();

router.get('/get', featureController.getAllFeatureImage.bind(featureController));
router.post('/add', featureController.addFeatureImage.bind(featureController));
router.delete('/delete/:id', featureController.deleteFeatureImage.bind(featureController));

export default router;