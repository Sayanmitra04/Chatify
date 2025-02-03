
import express from 'express';
import { register, login, logout,updateProfile,checkAuth} from '../controller/authcontroller.js';
import { protectRoute } from '../middleware/authmiddleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update-profile',protectRoute,updateProfile);//protectRoute is a middleware that checks if the user is logged in or not before updating the profile. put is used to update the profile.
router.get('/check',protectRoute,checkAuth);// this syntax means if the user is authenticated verified by protectRoute function first if authenticated then checkAuth function is called.

export default router;