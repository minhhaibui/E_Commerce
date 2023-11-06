import { Router } from "express";
import productController from "../app/controllers/product.js";
import { veryfyAccessToken, isAdmin } from "../app/middlewares/verifyToken.js";

const router = Router();
router.post("/", veryfyAccessToken, isAdmin, productController.createProduct);
router.get("/", productController.getProducts);
router.delete("/:id", productController.deleteProduct);
router.put("/:id", veryfyAccessToken, isAdmin, productController.updateProduct);
router.get("/:id", productController.getProduct);

export default router;
