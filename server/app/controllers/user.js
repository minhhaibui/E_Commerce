import modelUser from "../models/user.js";
import asynHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { sendMail } from "../../ultils/senEmail.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/jwt.js";

const register = asynHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body;
  if (!email || !password || !firstname || !lastname || !mobile) {
    return res.status(400).json({ success: false, message: "missing inputs" });
  }
  const user = await modelUser.findOne({ email });
  if (user) {
    throw new Error("user has existed");
  } else {
    const newUser = await modelUser.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      message: newUser
        ? "register is successfully , please go login"
        : "something went wrong",
    });
  }
});

const login = asynHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "missing inputs" });
  }
  const user = await modelUser.findOne({ email });
  const checklogin = await bcrypt.compare(password, user?.password);
  if (user && checklogin) {
    const { password, role, refreshToken, ...userData } = user.toObject();
    const accessToken = generateAccessToken(user._id, role);
    const newRefreshToken = generateRefreshToken(user._id);
    await modelUser.findByIdAndUpdate(
      user._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ accessToken, success: true, userData });
  } else {
    throw new Error("invalid credentials!");
  }
});
const refreshToken = asynHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken)
    throw new Error("no refresh token in cookie");
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);

  const response = await modelUser.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : " refresh token not matched",
  });
});

const logout = asynHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("no refresh token in cookie");
  modelUser.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: " " },
    { new: true }
  );
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  return res.status(200).json({ success: true, message: "logout is done" });
});

const getUserCurrent = asynHandler(async (req, res) => {
  const { _id } = req.user;
  const userCurrent = await modelUser
    .findById(_id)
    .select("-password -role -refreshToken");
  return res.status(200).json({
    success: userCurrent ? true : false,
    data: userCurrent ? userCurrent : "user not found",
  });
});

const forgotPassword = asynHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("missing  email");
  const user = await modelUser.findOne({ email });
  if (!user) throw new Error("user not found");

  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `xin vui lòng click vào link dưới đây để đổi mật khẩu của bạn. 
  link này sẽ hết hạn sau 15 phút kể từ bây giờ .
   <a href="${process.env.URL_SERVER}/api/user/reset-password/${resetToken}">click here</a>`;
  const data = {
    email,
    html,
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: true,
    rs,
  });
});

const resetpassword = asynHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!password || !token) throw new Error("missing  input");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await modelUser.findOne({
    passwordResetToken,
    passwordResetExprires: { $gt: Date.now() },
  });

  if (!user) throw new Error("invalid reset token");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangeAt = Date.now();
  user.passwordResetExprires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    message: user ? "updated password" : "something went wrong",
  });
});

const getUsers = asynHandler(async (req, res) => {
  const users = await modelUser.find().select("-password -role -refreshToken");
  return res.status(200).json({
    success: users ? true : false,
    users,
  });
});
const deleteUser = asynHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("missing ID");
  const response = await modelUser.findByIdAndDelete({ _id });
  return res.status(200).json({
    success: response ? true : false,
    message: response
      ? `user with email ${response.email} deleted`
      : "no user delete",
  });
});
const updateUser = asynHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("missing inputs");
  const { password, role } = req.body;
  if (password || role)
    throw new Error("Updating password or role is not allowed");
  const response = await modelUser.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  select(
    "-password -role -refreshToken -passwordResetToken -passwordResetExprires"
  );
  return res.status(200).json({
    success: response ? true : false,
    message: response ? response : "some thing went wrong",
  });
});
const updateUserByAdmin = asynHandler(async (req, res) => {
  const { id } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("missing inputs");
  const response = await modelUser
    .findByIdAndUpdate(id, req.body, {
      new: true,
    })
    .select(
      "-password -role -refreshToken -passwordResetToken -passwordResetExprires"
    );
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "some thing went wrong",
  });
});

const updateAddressUser = asynHandler(async (req, res) => {
  const { _id } = req.user;
  const { address } = req.body;
  const user = await modelUser.findById(_id);
  if (!address) throw new Error("missing inputs");
  if (user.address.find((el) => el === address))
    throw new Error("address already exists ");

  const response = await modelUser
    .findByIdAndUpdate(
      _id,
      { $push: { address: address } },
      {
        new: true,
      }
    )
    .select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "some thing went wrong",
  });
});
const addTocart = asynHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("missing inputs");
  const user = await modelUser.findById(_id);
  const alreadyProduct = user?.cart?.filter(
    (el) => el.product.toString() === pid
  );

  if (alreadyProduct.length !== 0) {
    const alreadyProductColor = alreadyProduct.find(
      (el) => el.color.toString() === color
    );
    if (alreadyProductColor) {
      const response = await modelUser.updateOne(
        { cart: { $elemMatch: alreadyProductColor } },
        { $set: { "cart.$.quantity": quantity } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "some thing went wrong",
      });
    } else {
      const response = await modelUser.findByIdAndUpdate(
        _id,
        {
          $push: { cart: { product: pid, quantity, color } },
        },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "some thing went wrong",
      });
    }
  } else {
    const response = await modelUser.findByIdAndUpdate(
      _id,
      {
        $push: { cart: { product: pid, quantity, color } },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "some thing went wrong",
    });
  }
});

export default {
  register,
  login,
  getUserCurrent,
  refreshToken,
  logout,
  forgotPassword,
  resetpassword,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateAddressUser,
  addTocart,
};
