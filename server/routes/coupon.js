import { Router } from "express";
import couponController from "../app/controllers/coupon.js";
import { veryfyAccessToken, isAdmin } from "../app/middlewares/verifyToken.js";

const router = Router();
router.post(
  "/",
  [veryfyAccessToken, isAdmin],
  couponController.createNewCoupon
);
router.get("/", couponController.getCoupons);
router.put(
  "/:cid",
  [veryfyAccessToken, isAdmin],
  couponController.updateCoupon
);
router.delete(
  "/:cid",
  [veryfyAccessToken, isAdmin],
  couponController.deleteCoupon
);

export default router;
