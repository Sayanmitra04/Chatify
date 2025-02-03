import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

export const protectRoute = async (req, res, next) => {
   
    try {
        const token=req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // in token userid is encoded so we are decoding it and match it with the user id in the database to check if the user is valid or not if valid then we make the user object available in the request object
        if(!decoded){
            return res.status(401).json({ message: "Not authorized, Invalid token" });
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user=user;
        
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
    }
