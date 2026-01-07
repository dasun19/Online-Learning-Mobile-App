import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Verifies JWT and attaches to req.user

export const verifyToken = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user and attach to request
        const user = await User.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Token invalidation check
        if (user.tokenVersion !== decoded.v) {
            return res.status(401).json({
                message: "Token no longer valid"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Role check

export const studentOnly = (req, res, next) => {
    if (req.user.role !== "student") {
        return res.status(403).json({ message: "Access denied: Student only" });
    }
    next();
};

const instructorOnly = (req, res, next) => {
    if (req.user.role !== "instructor") {
        return res.status(403).json({ message: "Access denied: Instructor only" })
    }
    next();
};

export const studentOrInstructor = (req, res, next) => {
    if (req.user.role !== "student" && req.user.role !== "instructor") {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};



