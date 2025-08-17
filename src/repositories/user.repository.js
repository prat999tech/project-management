/*import { User } from '../models/user.model.js';
import { CrudRepository } from './CrudRepository.js';

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async findByEmailOrUsername(email, username) {
        const user = await this.model.findOne({
            $or: [{ email }, { username }]
        });
        return user;
    }
    async findbyid(userid){
        const user=await this.model.findById(userid).select("-password -refreshtoken");
        return user;
    }
    
}

export { UserRepository };
*/
import { User } from '../models/user.model.js';
import { CrudRepository } from './CrudRepository.js';
import { redisClient } from '../db/redis.db.js';
//import { apierror } from '../utils/apierror.js';

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async findByEmailOrUsername(email, username) {
        // Caching isn't ideal here because the query key is not a stable ID.
        // It's better to fetch this directly from the database.
        const user = await this.model.findOne({
            $or: [{ email }, { username }]
        });
        return user;
    }

    async findbyid(userid) {
        const cacheKey = `${this.model.modelName}:${userid}`; // e.g., "User:some_user_id"

        // 1. Check Redis Cache First
        if (redisClient && redisClient.isOpen) {
            const cachedUser = await redisClient.get(cacheKey);
            if (cachedUser) {
                console.log(`CACHE HIT for key: ${cacheKey}`);
                // Data in Redis is stored as a string, so we parse it back into an object
                return JSON.parse(cachedUser);
            }
        }

        // 2. If not in cache (Cache Miss), fetch from MongoDB
        console.log(`CACHE MISS for key: ${cacheKey}. Fetching from DB.`);
        const user = await this.model.findById(userid).select("-password -refreshtoken");
        console.log(`Fetched user from DB: ${user}`);

        if (!user) {
            return null; // Return null if user not found in DB
        }

        // 3. Store the fresh data in Redis for future requests
        if (redisClient && redisClient.isOpen) {
            // Store the user object as a JSON string with a 1-hour expiration time (3600 seconds)
            await redisClient.set(cacheKey, JSON.stringify(user), {
                EX: 3600
            });
        }

        return user;
    }
}

export { UserRepository };

