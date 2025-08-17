// src/db/redis.db.js

import { createClient } from 'redis';

let redisClient;

const connectRedis = async () => {
    // Avoid creating multiple connections
    if (redisClient && redisClient.isOpen) {
        console.log("Redis client is already connected.");
        return;
    }

    try {
        // The client will use the REDIS_URL from your .env file
        redisClient = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });

        redisClient.on('error', (err) => console.error('Redis Client Error', err));

        await redisClient.connect();
        console.log("Redis client connected successfully.");

    } catch (error) {
        console.error("Failed to connect to Redis:", error);
    }
};

// Export the client and the connection function
export { connectRedis, redisClient };
