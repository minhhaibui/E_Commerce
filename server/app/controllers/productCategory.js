import modelProdCategory from "../models/productCategoty.js";
import asynHandler from "express-async-handler";

const createCategory = asynHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const newCategory = await modelProdCategory.create(req.body);
  return res.status(200).json({
    success: newCategory ? true : false,
    newCategory: newCategory ? newCategory : "can't create product - category",
  });
});

const getCaregories = asynHandler(async (req, res) => {
  const categories = await modelProdCategory.find().select("_id title");
  return res.status(200).json({
    success: categories ? true : false,
    categories: categories ? categories : "can't get product - category",
  });
});
const updateCategory = asynHandler(async (req, res) => {
  const { id } = req.params;
  const updateCategory = await modelProdCategory.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
    }
  );
  return res.status(200).json({
    success: updateCategory ? true : false,
    updateCategory: updateCategory ? updateCategory : "can't update category",
  });
});

const deleteCategory = asynHandler(async (req, res) => {
  const { id } = req.params;
  const deleteCategory = await modelProdCategory.findByIdAndDelete(id, {
    new: true,
  });
  return res.status(200).json({
    success: deleteCategory ? true : false,
    deleteCategory: deleteCategory ? deleteCategory : "can't delete category",
  });
});
export default {
  createCategory,
  getCaregories,
  updateCategory,
  deleteCategory,
};
