// src/models/ProgressUpdate.js
import mongoose from 'mongoose';

const ProgressUpdateSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    fileUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const ProgressUpdate = mongoose.model('ProgressUpdate', ProgressUpdateSchema);
export default ProgressUpdate;
