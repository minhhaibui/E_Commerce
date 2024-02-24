import { Router } from "express";
import productController from "../app/controllers/product.js";
import { veryfyAccessToken, isAdmin } from "../app/middlewares/verifyToken.js";
import uploader from "../config/cloudinary.config.js";
const router = Router();
router.post("/", veryfyAccessToken, isAdmin, productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.put("/ratings", veryfyAccessToken, productController.ratings);
router.put(
  "/uploadimage/:pid",
  [veryfyAccessToken, isAdmin],
  uploader.array("images", 10),
  productController.upLoadImagesProduct
);

router.delete(
  "/:id",
  [veryfyAccessToken, isAdmin],
  productController.deleteProduct
);
router.put("/:id", veryfyAccessToken, isAdmin, productController.updateProduct);

export default router;
