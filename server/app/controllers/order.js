import modelOder from "../models/order.js";
import modelUser from "../models/user.js";
import modelCoupon from "../models/coupon.js";
import asynHandler from "express-async-handler";

const createOrder = asynHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const userCart = await modelUser
    .findById(_id)
    .select("cart")
    .populate("cart.product", "title price");

  const products = userCart?.cart.map((el) => ({
    product: el.product._id,
    count: el.quantity,
    color: el.color,
  }));

  let total = userCart?.cart?.reduce(
    (sum, el) => el.product.price * el.quantity + sum,
    0
  );

  const createData = { products, total, orderBy: _id };
  if (coupon) {
    const selectedCoupon = await modelCoupon.findById(coupon);
    console.log(selectedCoupon);
    console.log(1 - +selectedCoupon.discount / 100);
    if (selectedCoupon) {
      total =
        Math.round((total * (1 - +selectedCoupon.discount / 100)) / 1000) *
          1000 || total;
      (createData.total = total), (createData.coupon = coupon);
    }
  }
  const rs = await modelOder.create(createData);
  return res.status(200).json({
    success: rs ? true : false,
    rs: rs ? rs : "something went wrong",
  });
});
const updateStatus = asynHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("missing input");
  const rs = await modelOder.findByIdAndUpdate(oid, { status }, { new: true });
  return res.status(200).json({
    success: rs ? true : false,
    rs: rs ? rs : "something went wrong",
  });
});
const getUserOrder = asynHandler(async (req, res) => {
  const { _id } = req.user;
  const rs = await modelOder.find({ orderBy: _id });
  return res.status(200).json({
    success: rs ? true : false,
    rs: rs ? rs : "something went wrong",
  });
});
const getOrderByAdmin = asynHandler(async (req, res) => {
  const rs = await modelOder.find();
  return res.status(200).json({
    success: rs ? true : false,
    rs: rs ? rs : "something went wrong",
  });
});

export default {
  createOrder,
  updateStatus,
  getUserOrder,
  getOrderByAdmin,
};
