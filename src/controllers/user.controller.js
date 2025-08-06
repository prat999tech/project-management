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

export {
    registerUser
};



