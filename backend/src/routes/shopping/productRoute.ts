import { Router } from "express";
import productController from "@controllers/shopping/product-controller";


const router = Router();

router.get("/get", productController.getAllProduct.bind(productController));
router.get("/getDetail/:id", productController.getProductDetail.bind(productController));
router.get("/getRelateProduct/:fruitType_id", productController.getRelateProduct.bind(productController));
router.get("/promotionWithProduct", productController.getPromotionsWithProduct.bind(productController));
export default router;
