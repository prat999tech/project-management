import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const userSchema=mongoose.Schema({
        username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
        index: true //it helps in searching in database
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
        index: true 
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    refreshtoken: {
        type: String,
        default: null
    },

    

},{ timestamps: true });
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})
userSchema.methods.isPasswordCorrect=async function(password){  
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.createAccessToken=function(){
    return jwt.sign({ id: this._id, role: this.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}
userSchema.methods.createRefreshToken=function(){
    return jwt.sign({ id: this._id, role: this.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}
export const User = mongoose.model('User', userSchema);

