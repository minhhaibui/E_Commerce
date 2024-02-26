import { Router } from "express";
import oderController from "../app/controllers/order.js";
import { veryfyAccessToken, isAdmin } from "../app/middlewares/verifyToken.js";

const router = Router();

router.post("/", [veryfyAccessToken], oderController.createOrder);
router.put(
  "/status/:oid",
  [veryfyAccessToken, isAdmin],
  oderController.updateStatus
);
router.get("/", veryfyAccessToken, oderController.getUserOrder);
router.get(
  "/admin",
  [veryfyAccessToken, isAdmin],
  oderController.getOrderByAdmin
);
export default router;
