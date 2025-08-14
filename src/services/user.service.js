import { UserRepository } from '../repositories/user.repository.js';
import { apierror } from '../utils/apierror.js';
import { User } from '../models/user.model.js';
import { publishMessage } from '../mq/rabbitmq.js'; // 1. Import the publisher
import { redisClient } from '../db/redis.db.js';

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async registerUser({ username, email, password, role, department }) {
        if ([username, email, password, role, department].some((field) => !field || field.trim() === "")) {
            throw new apierror(400, "All fields are required");
        }
        const existedUser = await this.userRepository.findByEmailOrUsername(email, username);
        if (existedUser) {
            throw new apierror(409, "User with email or username already exists");
        }

        const user = await this.userRepository.create({ username, email, password, role, department });
        const createduser = await this.userRepository.findbyid(user._id);

        if (!createduser) {
            throw new apierror(400, "User not created or something went wrong while registering user in db");
        }

        // --- 2. Publish a welcome email message ---
        const message = {
            email: createduser.email,
            username: createduser.username,
            type: 'WELCOME_EMAIL'
        };
        publishMessage('email_notifications', message);
        // --- API responds immediately after this ---

        return createduser;
    }

    async updateUser(userId, updateData) {
        const allowedUpdates = ['username', 'department', 'email'];
        const filteredUpdateData = {};
        for (const key in updateData) {
            if (allowedUpdates.includes(key)) {
                filteredUpdateData[key] = updateData[key];
            }
        }
        if (Object.keys(filteredUpdateData).length === 0) {
            throw new apierror(400, "No valid fields provided for update.");
        }

        const updatedUser = await this.userRepository.update(userId, filteredUpdateData);

        // --- Publish a details updated email message ---
        const message = {
            email: updatedUser.email,
            username: updatedUser.username,
            type: 'DETAILS_UPDATED'
        };
        publishMessage('email_notifications', message);

        return updatedUser;
    }

    async changePassword(userId, oldPassword, newPassword) {
        const user = await User.findById(userId);
        if (!user) {
            throw new apierror(404, "User not found");
        }
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        if (!isPasswordCorrect) {
            throw new apierror(401, "Invalid old password.");
        }
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });
        
        const cacheKey = `User:${userId}`;
        if (redisClient && redisClient.isOpen) {
            await redisClient.del(cacheKey);
        }

        // --- Publish a password changed email message ---
        const message = {
            email: user.email,
            username: user.username,
            type: 'PASSWORD_CHANGED'
        };
        publishMessage('email_notifications', message);
    }

    // Other methods like loginUser, logoutUser...
    async loginUser({ email, username,password }) {
        const user=await this.userRepository.findByEmailOrUsername(email,username);
        if(!user){
            throw new apierror(404,"user doesnt exist");
        }
        const isPasswordValid=await user.isPasswordCorrect(password);
        if(!isPasswordValid){
            throw new apierror(401,"invalid credentials");
        }
        const accessToken = user.createAccessToken();
        const refreshToken = user.createRefreshToken();
        user.refreshtoken = refreshToken;
        await user.save({ validateBeforeSave: false });
        const loggedInUser=await this.userRepository.findbyid(user._id);
        return {loggedInUser,accessToken,refreshToken};
    }

    async logoutUser(userId){
        await this.userRepository.update(userId,{
            $unset:{
                refreshtoken:1
            }
        });
    }
}

export { UserService };
