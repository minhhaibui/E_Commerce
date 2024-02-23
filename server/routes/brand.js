import { Router } from "express";
import brandController from "../app/controllers/brand.js";
import { veryfyAccessToken, isAdmin } from "../app/middlewares/verifyToken.js";

const router = Router();
router.post("/", [veryfyAccessToken, isAdmin], brandController.createBrand);
router.get("/", brandController.getBrand);
router.put("/:id", [veryfyAccessToken, isAdmin], brandController.updateBrand);
router.delete(
  "/:id",
  [veryfyAccessToken, isAdmin],
  brandController.deleteBrand
);

export default router;
