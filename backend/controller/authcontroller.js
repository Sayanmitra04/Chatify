import { generateToken } from "../lib/utils.js";
import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const register = async (req, res) => {

  const { name, email, password } = req.body;

  if(!name || !email || !password){
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be atleast 6 characters long" });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });

    if (!newUser) {
      return res.status(400).json({ message: "User not created" });
    }
    generateToken(newUser._id, res);
    await newUser.save();

    res
      .status(201)
      .json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic,
      }); // 201 status code is used for successful creation of a resource
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const login = async(req, res) => {
  const { email, password } = req.body;
  try{
        const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    res
      .status(200)
      .json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      });


  }
  catch(error){
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = (req, res) => {
  try{
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out" });
  }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePic}=req.body;
        const userId=req.user._id;
        if(!profilePic){
            return res.status(400).json({ message: "Profile picture is required" });
        }
         const uploadResponse=await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url } , { new: true });
        if (!updatedUser) {
            return res.status(400).json({ message: "User not found" });
        }
        res.status(200).json({updatedUser});  // show entire user object with updated profile picture fild that is created in the database
    
        
       
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
    }

export const checkAuth = (req, res) => {
    try {
        res.status(200).json({ user: req.user }); // it wil return the entire user object created in the database
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
    }
