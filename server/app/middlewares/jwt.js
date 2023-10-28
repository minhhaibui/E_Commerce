import jwt from "jsonwebtoken";
const generateAccessToken = (uid, role) => {
  return jwt.sign({ _id: uid, role }, process.env.JWT_SECRET, {
    expiresIn: "20s",
  });
};
const generateRefreshToken = (uid) => {
  return jwt.sign({ _id: uid }, process.env.JWT_SECRET, { expiresIn: "30s" });
};

export { generateAccessToken, generateRefreshToken };
