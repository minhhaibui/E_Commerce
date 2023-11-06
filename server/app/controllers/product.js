import modelProduct from "../models/product.js";
import asynHandler from "express-async-handler";
import slugify from "slugify";

const createProduct = asynHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await modelProduct.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    newProduct: newProduct ? newProduct : "can't create product",
  });
});

const getProduct = asynHandler(async (req, res) => {
  const { id } = req.params;
  const product = await modelProduct.findById(id);
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "product not found",
  });
});
const getProducts = asynHandler(async (req, res) => {
  const products = await modelProduct.find();
  return res.status(200).json({
    success: products ? true : false,
    productsData: products ? products : "can not get product",
  });
});

const updateProduct = asynHandler(async (req, res) => {
  const { id } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updateProduct = await modelProduct.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updateProduct ? true : false,
    updateProduct: updateProduct ? updateProduct : "can't update product",
  });
});

const deleteProduct = asynHandler(async (req, res) => {
  const { id } = req.params;
  const deleteProduct = await modelProduct.findByIdAndDelete(id, { new: true });
  return res.status(200).json({
    success: deleteProduct ? true : false,
    deleteProduct: deleteProduct ? deleteProduct : "can't update product",
  });
});
export default {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
