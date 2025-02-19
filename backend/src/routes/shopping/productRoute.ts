import { Router } from "express";
import productController from "@controllers/shopping/product-controller";


const router = Router();

router.get("/get", productController.getAllProduct.bind(productController));
router.get("/getDetail/:id", productController.getProductDetail.bind(productController));

export default router;
