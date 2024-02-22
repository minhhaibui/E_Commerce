import { Router } from "express";
import blogCategoryController from "../app/controllers/blogCategory.js";
import { veryfyAccessToken, isAdmin } from "../app/middlewares/verifyToken.js";

const router = Router();
router.post(
  "/",
  [veryfyAccessToken, isAdmin],
  blogCategoryController.createCategory
);
router.get("/", blogCategoryController.getCaregories);
router.put(
  "/:id",
  [veryfyAccessToken, isAdmin],
  blogCategoryController.updateCategory
);
router.delete(
  "/:id",
  [veryfyAccessToken, isAdmin],
  blogCategoryController.deleteCategory
);

export default router;
