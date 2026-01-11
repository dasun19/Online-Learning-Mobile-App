import dotenv from "dotenv";
dotenv.config();

import connectDB from "../src/config/db.js";
import app from "./app.js";

console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length);

const startServer = async () => {
    try {
        await connectDB();

        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error;
        });

        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        });

    } catch (error) {
        console.log("Server error", error.message);
    }
};

startServer();