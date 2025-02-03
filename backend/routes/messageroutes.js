import express from 'express';
import { protectRoute } from '../middleware/authmiddleware.js';
import { getUserForSidebar } from '../controller/messagecontroller.js';
import { getMessages } from '../controller/messagecontroller.js';
import { sendMessage } from '../controller/messagecontroller.js';

const router = express.Router();

router.get("/users",protectRoute,getUserForSidebar);
router.get("/:id",protectRoute,getMessages);
router.post("/send/:id",protectRoute,sendMessage);


export default router;