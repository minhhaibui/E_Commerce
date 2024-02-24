import { Router } from "express";
import userController from "../app/controllers/user.js";
import { veryfyAccessToken, isAdmin } from "../app/middlewares/verifyToken.js";

const router = Router();
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refreshToken", userController.refreshToken);

router.get("/userCurrent", veryfyAccessToken, userController.getUserCurrent);
router.get("/logout", userController.logout);
router.get("/forgotpassword", userController.forgotPassword);
router.get("/", veryfyAccessToken, isAdmin, userController.getUsers);

router.put("/resetpassword", userController.resetpassword);
router.put("/userCurrent", veryfyAccessToken, userController.updateUser);
router.put(
  "/updateaddress",
  veryfyAccessToken,
  userController.updateAddressUser
);

router.put(
  "/:id",
  veryfyAccessToken,
  isAdmin,
  userController.updateUserByAdmin
);

router.delete("/", veryfyAccessToken, isAdmin, userController.deleteUser);

export default router;
