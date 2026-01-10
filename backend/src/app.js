import express from "express";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import cors from "cors";

const app = express();


app.use(cors({
    origin: "*", // For testing - restrict this in production
    credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/courses", courseRoutes);

app.get("/", (req, res) => {
    res.json({
        status: "API running",
        message: "Online Learning App Backend"
    });
});


export default app;