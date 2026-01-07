import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            v: user.tokenVersion,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields must fill!" });
        }

        const existUser = await User.findOne({ email: email.toLowerCase() });

        if (existUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: role || "student"

        })

        res.status(201).json({
            message: "User registered successfully!",
            user: { id: user._id, name: user.name, email: user.email }
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error", error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields must fill!" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = generateToken(user);

        res.status(200).json({
            message: "User logged successfully!",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error!" });
    }
}

const logoutUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        user.tokenVersion += 1;
        await user.save();

        res.status(200).json({
            message: "Logged out successfully!"
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error!" });
    }
}

export {
    registerUser,
    loginUser,
    logoutUser
}