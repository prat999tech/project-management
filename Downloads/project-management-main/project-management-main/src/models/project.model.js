import mongoose from "mongoose";
const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    instructions: { // New field for specific instructions
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Ongoing', 'Completed', 'On Hold'],
        default: 'Ongoing'
    },
    priority: { // New field for priority level
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    facultyadvisor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    deadline:{
        type: Date,
        required: true
    },
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    }
},{timestamps: true});
export const Project = mongoose.model('Project', projectSchema);
