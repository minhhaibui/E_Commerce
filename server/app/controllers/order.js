import modelOder from "../models/order.js";
import modelUser from "../models/user.js";
import asynHandler from "express-async-handler";

const createOrder = asynHandler(async (req, res) => {
  const { _id } = req.user;
  const userCart = await modelUser.findById(_id).select("cart");
  return res.status(200).json({
    success: userCart ? true : false,
    userCart: userCart ? userCart : "can't create blog ",
  });
});

export default {
  createOrder,
};
