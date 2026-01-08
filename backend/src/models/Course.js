import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 100,
    },
    description: {
        type: String,
        required: true,
        maxLength: 500,
    },
    instructor: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
    },
    content: [
        {
            title: String,
            body: String
        }
    ]
},
    {
        timestamps: true
    }
);

export const Course = mongoose.model("Course", courseSchema);