import { Router } from "express";
import { loginUser, logoutUser, registerUser } from '../controllers/authController.js';
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// Register route
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout requires valid JWT
router.post("/logout", verifyToken, logoutUser);

export default router;

