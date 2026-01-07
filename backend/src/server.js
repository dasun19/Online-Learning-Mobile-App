import dotenv from "dotenv";
import connectDB from "../src/config/db.js";
import app from "./app.js";

dotenv.config({ path: "./.env" });

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