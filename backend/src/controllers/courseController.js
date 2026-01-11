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
            instructorId: req.user._id,
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

        const userId = req.user._id.toString();
        const courses = await Course.find();

        const coursesWithEnrollInfo = courses.map((course) => ({
            _id: course._id,
            title: course.title,
            description: course.description,
            enrolledCount: course.enrolledStudents?.length || 0,
            instructor: course.instructor,
            isEnrolled: course.enrolledStudents
                ? course.enrolledStudents.map(id => id.toString()).includes(userId)
                : false,
            instructorId: course.instructorId,

        }));
        res.status(200).json(coursesWithEnrollInfo)
    } catch (error) {
        console.log(error);
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
        const { title, description, content } = req.body;

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { title, description, content },
            { new: true, runValidators: true }
        )

        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
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

// Student enroll to a course
export const enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) return res.status(404).json({ message: "Course not found!" });

        if (course.enrolledStudents.includes(req.user._id)) {
            return res.status(400).json({ message: "Already enrolled in this course!" });
        }

        course.enrolledStudents.push(req.user._id);
        await course.save();

        res.status(200).json({ message: "Enrolled successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get student enrolled courses list
export const getEnrolledCourses = async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Only students can access their courses!" });
        }

        const courses = await Course.find({ enrolledStudents: req.user._id });

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get instructors' courses
export const getInstructorCourses = async (req, res) => {
    try {
        if (req.user.role !== "instructor") {
            return res.status(403).json({ message: "Only instructors can access this!" });
        }

        const courses = await Course.find({ instructorId: req.user._id });
        const coursesWithCount = courses.map(course => ({
            _id: course._id,
            title: course.title,
            description: course.description,
            content: course.content,
            instructor: course.instructor,
            instructorId: course.instructorId,
            enrolledCount: course.enrolledStudents?.length || 0,
            enrolledStudents: course.enrolledStudents
        }));

        res.status(200).json(coursesWithCount);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get enrolled students for a specific course
export const getCourseStudents = async (req, res) => {
    try {
        console.log("Getting students for course:", req.params.id);
        console.log("User:", req.user._id, "Role:", req.user.role);

        const course = await Course.findById(req.params.id)
            .populate("enrolledStudents", "name email createdAt");

        if (!course) {
            console.log("Course not found");
            return res.status(404).json({ message: "Course not found!" });
        }

        console.log("Course found:", course.title);
        console.log("Enrolled students count:", course.enrolledStudents.length);

        // Check if the instructor owns this course
        if (req.user.role === "instructor" && course.instructorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to view these students!" });
        }

        // Format the response
        const students = course.enrolledStudents.map(student => ({
            _id: student._id,
            name: student.name,
            email: student.email,
            enrolledAt: student.createdAt
        }));

        console.log("Returning students:", students);

        res.status(200).json(students);
    } catch (error) {
        console.log("Error in getCourseStudents:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Unenroll from a course
export const unenrollCourse = async (req, res) => {
    try {
        const courseId = req.params.id; 
        console.log("Unenroll - Course ID:", courseId);
        console.log("Unenroll - User ID:", req.user._id);
        console.log("Unenroll - User Role:", req.user.role);

        // Check if user is a student
        if (req.user.role !== "student") {
            return res.status(403).json({ 
                message: "Only students can unenroll from courses!" 
            });
        }

        // Find the course
        const course = await Course.findById(courseId);
        
        if (!course) {
            console.log("Course not found with ID:", courseId);
            return res.status(404).json({ message: "Course not found" });
        }

        console.log("Course found:", course.title);

        // Check if student is enrolled
        const isEnrolled = course.enrolledStudents.some(
            studentId => studentId.toString() === req.user._id.toString()
        );

        if (!isEnrolled) {
            return res.status(400).json({ 
                message: "You are not enrolled in this course" 
            });
        }

        // Remove student from course's enrolledStudents array
        course.enrolledStudents = course.enrolledStudents.filter(
            studentId => studentId.toString() !== req.user._id.toString()
        );
        
        await course.save();

        res.status(200).json({ 
            message: "Successfully unenrolled from course",
            courseId: courseId
        });

    } catch (error) {
        console.log("Error in unenrollCourse:", error);
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
};