import { Router } from "express";
import blogController from "../app/controllers/blog.js";
import { veryfyAccessToken, isAdmin } from "../app/middlewares/verifyToken.js";

const router = Router();

router.post("/", [veryfyAccessToken, isAdmin], blogController.createBlog);
router.put("/:bid", [veryfyAccessToken, isAdmin], blogController.updateBlog);
router.get("/", blogController.getBlogs);
router.delete("/:bid", [veryfyAccessToken, isAdmin], blogController.deleteBlog);
export default router;
