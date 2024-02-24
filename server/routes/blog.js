import { Router } from "express";
import blogController from "../app/controllers/blog.js";
import { veryfyAccessToken, isAdmin } from "../app/middlewares/verifyToken.js";
import uploader from "../config/cloudinary.config.js";

const router = Router();

router.post("/", [veryfyAccessToken, isAdmin], blogController.createBlog);
router.put("/like/:bid", [veryfyAccessToken], blogController.likeBlog);
router.put("/dislike/:bid", [veryfyAccessToken], blogController.dislikeBlog);
router.put("/:bid", [veryfyAccessToken, isAdmin], blogController.updateBlog);
router.put(
  "/uploadimage/:bid",
  [veryfyAccessToken, isAdmin],
  uploader.single("image"),
  blogController.upLoadImagesBlog
);
router.get("/:bid", blogController.getblog);
router.get("/", blogController.getBlogs);
router.delete("/:bid", [veryfyAccessToken, isAdmin], blogController.deleteBlog);

export default router;
