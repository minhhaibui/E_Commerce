import asynHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const veryfyAccessToken = asynHandler(async (req, res, next) => {
  if (req.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers?.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, mes: "invalid access token" });
      }
      req.user = decode;
      next();
    });
  } else {
    return res
      .status(401)
      .json({ success: false, mes: "require authentication" });
  }
});
export { veryfyAccessToken };
