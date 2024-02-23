import modelBrand from "../models/brand.js";
import asynHandler from "express-async-handler";

const createBrand = asynHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const newBrand = await modelBrand.create(req.body);
  return res.status(200).json({
    success: newBrand ? true : false,
    newBrand: newBrand ? newBrand : "can't create brand",
  });
});

const getBrand = asynHandler(async (req, res) => {
  const brands = await modelBrand.find().select("_id title");
  return res.status(200).json({
    success: brands ? true : false,
    brands: brands ? brands : "can't get brand",
  });
});
const updateBrand = asynHandler(async (req, res) => {
  const { id } = req.params;
  const updateBrand = await modelBrand.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updateBrand ? true : false,
    updateBrand: updateBrand ? updateBrand : "can't update brand",
  });
});

const deleteBrand = asynHandler(async (req, res) => {
  const { id } = req.params;
  const deleteBrand = await modelBrand.findByIdAndDelete(id, {
    new: true,
  });
  return res.status(200).json({
    success: deleteBrand ? true : false,
    deletedBrand: deleteBrand ? deleteBrand : "can't delete brand",
  });
});
export default {
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
};
