import { Router } from "express";
import productCategoryController from "../app/controllers/productCategory.js";
import { veryfyAccessToken, isAdmin } from "../app/middlewares/verifyToken.js";

const router = Router();
router.post(
  "/",
  [veryfyAccessToken, isAdmin],
  productCategoryController.createCategory
);
router.get("/", productCategoryController.getCaregories);
router.put(
  "/:id",
  [veryfyAccessToken, isAdmin],
  productCategoryController.updateCategory
);
router.delete(
  "/:id",
  [veryfyAccessToken, isAdmin],
  productCategoryController.deleteCategory
);

export default router;
