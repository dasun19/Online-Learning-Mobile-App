import { Course } from "../models/Course.js";


// Create a course
export const courseCreate = async (req, res) => {
    try {
        const { title, description, content } = req.body;

        if (!title || !description || !content) {
            return res.status(400).json({ message: "All fields must fill!" });
        }

        const existCourse = await Course.findOne({ title: title });

        if (existCourse) {
            return res.status(400).json({ message: "Course already exists!" });
        }

        const course = await Course.create({
            title,
            description,
            instructor: req.user.name, // Logged instructor 
            content: Array.isArray(content) ? content : [] // Optional content
        })

        res.status(201).json({
            message: "Course created successfully!",
            course: {
                id: course._id, title: course.title, instructor: course.instructor
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error!", error: error.message })
    }
};

// Get all courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get a single course
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a course
export const updateCourse = async (req, res) => {
    try {
        const { title, description, instructor } = req.body;

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { title, description, content },
            { new: true, runValidators: true }
        )

        if (!course) {
            return res.status(500).json({ message: "Course not found!" });
        }

        res.status(200).json({
            message: "Course updated successfully!"
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a course
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }

        res.status(200).json({ message: "Course deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

