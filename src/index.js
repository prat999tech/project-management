import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import connectDB from './db/index.db.js';
import { connectRedis } from './db/redis.db.js';
import { connectRabbitMQ } from './mq/rabbitmq.js'; // 1. Import the RabbitMQ connector

// Connect to MongoDB
connectDB()
    .then(() => {
        // After MongoDB is connected, connect to other services
        connectRedis();
        connectRabbitMQ(); // 2. Call the function to connect to RabbitMQ

        import('./app.js')
            .then(({ app }) => {
                app.listen(process.env.PORT || 8000, () => {
                    console.log(`⚙️ Server is running on port : ${process.env.PORT || 8000}`);
                });
            })
            .catch((err) => {
                console.error("Express App startup failed:", err);
                process.exit(1);
            });
    })
    .catch((error) => {
        console.log("MongoDB connection FAILED !!!", error);
        process.exit(1);
    });
