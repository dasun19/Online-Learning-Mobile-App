import express from "express";
import {
    courseCreate,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} from "../controllers/courseController.js";
import {
    verifyToken,
    instructorOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Instructor only routes
router.post("/create", verifyToken, instructorOnly, courseCreate);
router.put("/:id", verifyToken, instructorOnly, updateCourse);
router.delete("/:id", verifyToken, instructorOnly, deleteCourse);

export default router;