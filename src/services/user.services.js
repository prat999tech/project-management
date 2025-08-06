import { UserRepository } from '../repositories/user.repository.js';
import { apierror } from '../utils/apierror.js';
import bcrypt from 'bcrypt';

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

    // You can add other user-related services here, like loginUser
    async loginUser({ email, password }) {
        // TODO: Implement login logic
        // 1. Find user by email
        // 2. Compare password
        // 3. Generate JWT token
        // 4. Return user and token
    }
}

export { UserService };
