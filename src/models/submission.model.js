import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    content: {
        type: String,
        trim: true
    },
    fileUrl: {
        type: String, // URL to the uploaded file (e.g., from Cloudinary or S3)
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending Review', 'Approved', 'Rejected'],
        default: 'Pending Review'
    },
    grade: {
        type: String,
        trim: true
    },
    feedback: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export const Submission = mongoose.model('Submission', submissionSchema);
