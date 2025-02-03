import User from '../models/usermodel.js';
import Message from '../models/messagemodel.js';
import cloudinary from '../lib/cloudinary.js';
import { io , getReceiverSocketId} from '../lib/socket.js';
export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        console.log("filtered user: "+filteredUsers); // Log the users to check if they are being fetched

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
}

// to filter the user who are logged in and who are not.

export const getMessages = async (req, res) => {
    try{

        const {id:userToChatId}=req.params;
        const myId=req.user._id; //loggedInUserId
        
        const messages = await Message.find({ $or: [{ senderId:myId, receiverId:userToChatId }, { senderId: userToChatId, receiverId: myId }] });

        res.status(200).json( messages );
    }
    catch(error){
        console.log(error);
    }
}   // to get the all messages I send to other or other send to me.



export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body; // Extract text and image from request body
        const { id: receiverId } = req.params; // Extract receiverId from request parameters
        const myId = req.user._id; // loggedInUserId (from the protectRoute middleware)
        
        if (!receiverId || !text) {
            return res.status(400).json({ error: "Receiver ID and message text are required." });
        }

        let imageurl;
        if (image) {
            // Handle image upload if provided
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageurl = uploadResponse.secure_url;
        }

        // Create new message
        const newMessage = new Message({
            senderId: myId,
            receiverId: receiverId, // Corrected this to receiverId
            text,
            image: imageurl,
        });

        // Save the new message
        await newMessage.save();

        // Find the receiver's socket ID (assuming getReceiverSocketId is implemented)
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // Emit the new message to the receiver
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // Send success response
        return res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}
   // to send message to others.

