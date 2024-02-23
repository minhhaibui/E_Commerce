import modelBlog from "../models/blog.js";
import asynHandler from "express-async-handler";

const createBlog = asynHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("Missing inputs");
  const blog = await modelBlog.create(req.body);
  return res.status(200).json({
    success: blog ? true : false,
    blog: blog ? blog : "can't create blog ",
  });
});

const updateBlog = asynHandler(async (req, res) => {
  const { bid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const blogUpdate = await modelBlog.findByIdAndUpdate(bid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: blogUpdate ? true : false,
    blogUpdate: blogUpdate ? blogUpdate : "can't update blog ",
  });
});
const getBlogs = asynHandler(async (req, res) => {
  const blogs = await modelBlog.find();
  return res.status(200).json({
    success: blogs ? true : false,
    blogs: blogs ? blogs : "can't get blogs ",
  });
});
const deleteBlog = asynHandler(async (req, res) => {
  const { bid } = req.params;
  const deleteBlog = await modelBlog.findByIdAndDelete(bid, { new: true });
  return res.status(200).json({
    success: deleteBlog ? true : false,
    deleteBlog: deleteBlog ? deleteBlog : "can't delete product",
  });
});

export default {
  createBlog,
  updateBlog,
  getBlogs,
  deleteBlog,
};
