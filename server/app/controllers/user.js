import modelUser from "../models/user.js";
import asynHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    const { password, role, ...userData } = user.toObject();
    const accessToken = generateAccessToken(user._id, role);
    const refreshToken = generateRefreshToken(user._id);
    await modelUser.findByIdAndUpdate(
      user._id,
      { refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
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
const getUserById = asynHandler(async (req, res) => {
  const { _id } = req.user;
  const userCurrent = await modelUser
    .findById(_id)
    .select("-password -role -refreshToken");
  return res.status(200).json({
    success: userCurrent ? true : false,
    data: userCurrent ? userCurrent : "user not found",
  });
});

export default {
  register,
  login,
  getUserById,
  refreshToken,
  logout,
};
