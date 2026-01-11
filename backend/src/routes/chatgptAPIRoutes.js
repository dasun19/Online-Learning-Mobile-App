import express from "express";
import { getCourseRecommendations, getRequestCount } from "../controllers/chatgptAPIController.js";
import { verifyToken, studentOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/recommendations", verifyToken, studentOnly, getCourseRecommendations);
router.get("/request-count", verifyToken, studentOnly, getRequestCount);

export default router;