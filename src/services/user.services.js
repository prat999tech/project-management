import { UserRepository } from '../repositories/user.repository.js';
import { apierror } from '../utils/apierror.js';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }
    async generateAccessTokenandRefreshToken(userid){
        try{
            const user=await User.findById(userid);
            const accessToken=await user.createAccessToken();
            const refreshToken=await user.createRefreshToken();
            user.refreshToken=refreshToken;
            await user.save({validateBeforeSave:false});
            return {accessToken,refreshToken};
        }
        catch(error){
            console.error(error);
            throw new apierror(404,"something went wrong while generating access and refresh token");
        }
    }

    async registerUser({ username, email, password, role, department }) {
        if ([username, email, password, role, department].some((field) => !field || field.trim() === "")) {
            throw new apierror(400, "All fields are required");
        }

        const existedUser = await this.userRepository.findByEmailOrUsername(email, username);
        if (existedUser) {
            throw new apierror(409, "User with email or username already exists"); // 409 Conflict
        }


        const user = await this.userRepository.create({
            username,
            email,
            password: hashedPassword,
            role,
            department
        });

          const createduser=await this.userRepository.findbyid(user._id);
        if(!createduser){
            throw new apierror(400,"user not created or something went wrong while registering user in db");

        }

        return createduser;
    }

    async loginUser({ email, username,password }) {
        const user=await this.userRepository.findByEmailOrUsername(email,username);
        if(!user){
            throw new apierror(404,"user doesnt exist");

        }
        const isPasswordValid=await user.isPasswordCorrect(password);
        if(!isPasswordValid){
            throw new apierror(401,"invalid credentials");

        }
        const {AccessToken,RefreshToken}=user.generateAccessTokenandRefreshToken(user._id);
        const loggedInUser=await this.userRepository.findbyid(user._id);
        return {loggedInUser,AccessToken,RefreshToken};
        

        
    }
}

export { UserService };
