/*import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { apierror } from '../utils/apierror.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {apiresponse} from '../utils/apiresponse.js';
const registerUser=asyncHandler(async(req,res,next)=>{
    console.log("inside register user");
    const {username,email,password,role,department}=req.body;
    if([username,email,password,role,department].some((field)=>field?.trim()==="")){
        console.log("fields missing");
        throw new apierror(400,"all fields are required");
        
    }
    const existeduser=await User.findOne({
        $or:[{username},{email}]
    });
    if(existeduser){
        throw new apierror(400,"user already exists");
    }
    const user=await User.create({
        username,
        email,
        password,
        role,
        department
    });
    if(!user){
        throw new apierror(400,"user not created or something went wrong while registering user in db");

    }
    const createduser=await User.findById(user._id).select(
        "-password -refreshtoken"
    )
    if(!createduser){
        throw new apierror(400,"user not created or something went wrong while registering user in db");

    }
    return res.status(200).json(
        apiresponse(200,"user created successfully",createduser)
    )

    
    

})
*/



//----------------------------//
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiresponse } from '../utils/apiresponse.js';
import { UserService } from '../services/user.service.js';
import { StatusCodes } from 'http-status-codes';

const userService = new UserService();

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role, department } = req.body;

    const createdUser = await userService.registerUser({
        username,
        email,
        password,
        role,
        department
    });

    return res.status(StatusCodes.CREATED).json(
        new apiresponse(StatusCodes.CREATED, createdUser, "User registered successfully")
    );
});

// Add other controllers as you build them
// const loginUser = asyncHandler(async (req, res) => { ... });
const loginUser=asyncHandler(async(req,res,)=>{
    console.log("inside login user");
    const {username,email,password}=req.body;
    if([username,email,password].some((field)=>field?.trim()==="")){
        console.log("fields missing");
        throw new apierror(400,"all fields are required");
        
    }
    const {loggedInUser,accessToken,refreshToken}=await userService.loginUser({
        username,
        email,
        password
    });
    const options={
        httpOnly:true,
        secure:true

    };
    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
        new apiresponse(200,{
            loggedInUser,
            accessToken,
            refreshToken
        },
        "user logged in successfully"
    )
    );
    
})
const logoutUser=asyncHandler(async(req,res)=>{
    await UserService.logoutUser(req.user._id);
    const options={
        httpOnly:true,
        secure:process.env.NODE_ENV==="production"
    }
    return res
    .status(StatusCodes.OK)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiresponse(StatusCodes.OK,"user logged out successfully"));


    }
    
);
const updateUser = asyncHandler(async (req, res) => {
    // The user's ID is attached to the request by the `verifyJWT` middleware.
    const userId = req.user._id;
    const updateData = req.body;

    const updatedUser = await userService.updateUser(userId, updateData);

    return res
        .status(StatusCodes.OK)
        .json(new apiresponse(StatusCodes.OK, updatedUser, "User details updated successfully"));
});
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Basic validation
    if (!newPassword || !oldPassword) {
        throw new apierror(400, "Old password and new password are required.");
    }
    if (newPassword !== confirmPassword) {
        throw new apierror(400, "The new password and confirmation password do not match.");
    }

    // `req.user` is available from the `verifyJWT` middleware
    await userService.changePassword(req.user._id, oldPassword, newPassword);

    return res
        .status(StatusCodes.OK)
        .json(new apiresponse(StatusCodes.OK, {}, "Password changed successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    changeCurrentPassword
};



