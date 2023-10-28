import { Router } from "express";
import userController from "../app/controllers/user.js";
import { veryfyAccessToken } from "../app/middlewares/verifyToken.js";

const router = Router();
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/userCurrent", veryfyAccessToken, userController.getUserById);
router.post("/refreshToken", userController.refreshToken);
router.get("/logout", userController.logout);

export default router;
