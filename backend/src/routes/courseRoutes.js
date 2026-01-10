import express from "express";
import {
    courseCreate,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollCourse,
    getEnrolledCourses,
    getInstructorCourses
} from "../controllers/courseController.js";
import {
    verifyToken,
    instructorOnly,
    studentOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();





// Student only routes
router.get("/for-students", verifyToken, studentOnly, getAllCourses);
router.post("/:id/enroll", verifyToken, studentOnly, enrollCourse);
router.get("/enrolled/list", verifyToken, studentOnly, getEnrolledCourses);

// Instructor only routes
router.post("/create", verifyToken, instructorOnly, courseCreate);
router.put("/:id", verifyToken, instructorOnly, updateCourse);
router.delete("/:id", verifyToken, instructorOnly, deleteCourse);
router.get("/my-courses/list", verifyToken, instructorOnly, getInstructorCourses);

// Public routes
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

export default router;