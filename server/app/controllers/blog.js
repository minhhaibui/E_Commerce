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
    deletedBlog: deleteBlog ? deleteBlog : "can't delete blog",
  });
});

const likeBlog = asynHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing inputs");
  const blog = await modelBlog.findById(bid);
  const alreadyDisLike = blog?.dislikes?.find((el) => el.toString() === _id);
  if (alreadyDisLike) {
    const response = await modelBlog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      rs: response,
    });
  }

  const isliked = blog?.likes?.find((el) => el.toString() === _id);
  if (isliked) {
    const response = await modelBlog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await modelBlog.findByIdAndUpdate(
      bid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      rs: response,
    });
  }
});
const dislikeBlog = asynHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  console.log(bid);
  if (!bid) throw new Error("Missing inputs");
  const blog = await modelBlog.findById(bid);
  const alreadyLike = blog?.likes?.find((el) => el.toString() === _id);
  if (alreadyLike) {
    const response = await modelBlog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      rs: response,
    });
  }

  const isdisliked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (isdisliked) {
    const response = await modelBlog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await modelBlog.findByIdAndUpdate(
      bid,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      rs: response,
    });
  }
});

const getblog = asynHandler(async (req, res) => {
  const excludeFields = "firstname lastname";
  const { bid } = req.params;
  const blog = await modelBlog
    .findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true })
    .populate("likes", excludeFields)
    .populate("dislikes", excludeFields);

  return res.json({
    success: blog ? true : false,
    re: blog,
  });
});

const upLoadImagesBlog = asynHandler(async (req, res) => {
  console.log(req.file);
  const { bid } = req.params;
  if (!req.file) throw new Error("missing input");
  const response = await modelBlog.findByIdAndUpdate(
    bid,
    { image: req.file.path },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    updatedBlog: response ? response : "can't upload image blog",
  });
});
export default {
  createBlog,
  updateBlog,
  getBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  getblog,
  upLoadImagesBlog,
};
