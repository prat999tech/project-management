import { Router } from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    changeCurrentPassword // Import the new controller
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// --- Public Routes ---
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);


// --- Secured Routes ---
// These routes require a user to be logged in.
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/update-details').patch(verifyJWT, updateUser);
router.route('/change-password').post(verifyJWT, changeCurrentPassword); // New route


export default router;
