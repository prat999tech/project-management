import mongoose from "mongoose";
const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true // it helps in searching in database
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'on hold'],
        default: 'ongoing'
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
    