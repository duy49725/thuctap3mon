import { Router } from "express";
import cartController from "@controllers/shopping/cart-controller";

const router = Router();

router.post("/add", cartController.addToCart.bind(cartController));
router.put("/update", cartController.updateFormCart.bind(cartController));
router.delete("/remove/:cartDetail_Id", cartController.removeFromCart.bind(cartController));
export default router;