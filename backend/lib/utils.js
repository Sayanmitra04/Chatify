import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,  // prevent client side javascript from accessing the cookie
    sameSite:"strict", // cookie will only be set in the same origin
    secure: process.env.NODE_ENV === "production" ? true : false, // cookie will only be set in https
  });
    return token;
};
