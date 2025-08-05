import mongoose from "mongoose";
const projectSchema = mongoose.Schema({
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    meetingDate:{
        type: Date,
        required: true
    },
    meetingTime:{
        type: String,
        required: true
    },
    agenda:{
        type: String,
        required: true,
        trim: true
    },
    notes:{
        type: String,
        trim: true
    },
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
},{ timestamps: true });
export const Meeting = mongoose.model('Meeting', projectSchema);