import modelCoupon from "../models/coupon.js";
import asynHandler from "express-async-handler";

const createNewCoupon = asynHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Missing inputs");
  const newCoupon = await modelCoupon.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: newCoupon ? true : false,
    newCoupon: newCoupon ? newCoupon : "can't create new coupon",
  });
});
const getCoupons = asynHandler(async (req, res) => {
  const Coupons = await modelCoupon.find().select("-createdAt -updatedAt");
  return res.status(200).json({
    success: Coupons ? true : false,
    Coupons: Coupons ? Coupons : "can't get coupon",
  });
});

const updateCoupon = asynHandler(async (req, res) => {
  const { cid } = req.params;

  if (Object.keys(req.body).length === 0) throw new Error("missing input");
  if (req.body.expiry) {
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  }

  const updateCoupon = await modelCoupon.findByIdAndUpdate(cid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updateCoupon ? true : false,
    updatedCoupon: updateCoupon ? updateCoupon : "can't update Coupon",
  });
});

const deleteCoupon = asynHandler(async (req, res) => {
  const { cid } = req.params;
  const deleteCoupon = await modelCoupon.findByIdAndDelete(cid, {
    new: true,
  });
  return res.status(200).json({
    success: deleteCoupon ? true : false,
    deletedCoupon: deleteCoupon ? deleteCoupon : "can't delete Coupon",
  });
});
export default {
  createNewCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
};
