import { UserRepository } from '../repositories/user.repository.js';
import { apierror } from '../utils/apierror.js';
import { User } from '../models/user.model.js';
import { redisClient } from '../db/redis.db.js';

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
    async logoutUser(userId){
        await this.userRepository.update(userId,{
            $unset:{
                refreshToken:1
            }
        });
    }
    async updateUser(userId, updateData) {
        // To prevent users from updating sensitive fields, we define what is allowed.
        const allowedUpdates = ['username', 'department','email'];
        const filteredUpdateData = {};

        // Loop through the provided data and only keep the allowed fields.
        for (const key in updateData) {
            if (allowedUpdates.includes(key)) {
                filteredUpdateData[key] = updateData[key];
            }
        }

        if (Object.keys(filteredUpdateData).length === 0) {
            throw new apierror(400, "No valid fields provided for update.");
        }

        // The repository's update method will automatically invalidate the cache.
        const updatedUser = await this.userRepository.update(userId, filteredUpdateData);
        return updatedUser;
    }
    async changePassword(userId, oldPassword, newPassword) {
        // We fetch the user directly from the model to ensure we get the password field,
        // which our repository's findbyid method excludes by default.
        const user = await User.findById(userId);
        if (!user) {
            throw new apierror(404, "User not found");
        }

        // Check if the provided old password is correct.
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        if (!isPasswordCorrect) {
            throw new apierror(401, "Invalid old password.");
        }

        // Set the new password. The 'pre-save' hook in the user model will hash it automatically.
        user.password = newPassword;
        await user.save({ validateBeforeSave: false }); // We set false as we're only updating the password.
        
        // Since we updated the user document, we must invalidate the cache manually
        // because we didn't use the repository's update method.
        const cacheKey = `User:${userId}`;
        if (redisClient && redisClient.isOpen) {
            await redisClient.del(cacheKey);
            console.log(`CACHE INVALIDATED for user password change: ${cacheKey}`);
        }
    }
   
}

export { UserService };
