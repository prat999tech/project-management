import mongoose from "mongoose";
const projectSchema = mongoose.Schema({
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    submittedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileurl:{
        type: String,
        required: true,
        
    },
    studentcomment:{
        type: String,
        trim: true
    },
    submitteddate:{
        type: Date,
        default: Date.now
    },
    feedback:{
        text:String,
        givenby:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },


    },
    marks:{
        type: Number,
        min: 0,
        max: 100,
        default: 0
    }
},{timestamps: true});
export const Submission = mongoose.model('Submission', projectSchema);