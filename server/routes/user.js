import { Router } from "express";
import userController from "../app/controllers/user.js";
import { veryfyAccessToken, isAdmin } from "../app/middlewares/verifyToken.js";

const router = Router();
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/userCurrent", veryfyAccessToken, userController.getUserCurrent);
router.post("/refreshToken", userController.refreshToken);
router.get("/logout", userController.logout);
router.get("/forgotpassword", userController.forgotPassword);
router.put("/resetpassword", userController.resetpassword);
router.get("/", veryfyAccessToken, isAdmin, userController.getUsers);
router.delete("/", veryfyAccessToken, isAdmin, userController.deleteUser);
router.put("/userCurrent", veryfyAccessToken, userController.updateUser);
router.put(
  "/:id",
  veryfyAccessToken,
  isAdmin,
  userController.updateUserByAdmin
);

export default router;
