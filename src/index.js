import dotenv from 'dotenv';
dotenv.config({ path: './env' });

// Import the database connection function
import connectDB from './db/index.db.js';
import { connectRedis } from './db/redis.db.js';

// Import the Express application instance
// We will import it inside the .then block to ensure Mongoose is initialized
// import { app } from './app.js'; // <-- Comment out or remove this import here

// Connect to the database
connectDB()
    // If the database connection is successful, then start the application server
    .then(() => {
        // Import the app here, after the database connection is established.
        // This ensures that any files imported by app.js (like models)
        // will be processed when Mongoose is ready.
        connectRedis();

        import('./app.js')
            .then(({ app }) => { // Use dynamic import and destructure 'app'
                // Start the Express application server
                app.listen(process.env.PORT || 3000, () => {
                    console.log(`⚙️ Server is running on port : ${process.env.PORT || 8000}`);
                });
            })
            .catch((err) => {
                console.error("Express App startup failed:", err);
                // Exit the process if the app fails to start after DB connection
                process.exit(1);
            });
    })
    // If the database connection fails, log the error and exit the process
    .catch((error) => {
        console.log("MongoDB connection FAILED !!!", error);
        process.exit(1); // Exit the process on database connection failure
    });