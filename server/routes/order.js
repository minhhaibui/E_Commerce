import { Router } from "express";
import oderController from "../app/controllers/order.js";
import { veryfyAccessToken, isAdmin } from "../app/middlewares/verifyToken.js";

const router = Router();

router.post("/", [veryfyAccessToken], oderController.createOrder);
// router.put("/like/:bid", [veryfyAccessToken], oderController.likeBlog);
// router.put("/dislike/:bid", [veryfyAccessToken], oderController.dislikeBlog);
// router.put("/:bid", [veryfyAccessToken, isAdmin], oderController.updateBlog);
// router.get("/:bid", oderController.getblog);
// router.get("/", oderController.getBlogs);
// router.delete("/:bid", [veryfyAccessToken, isAdmin], oderController.deleteBlog);

export default router;
