import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://%2Ftmp%2Fmongodb%2Fmongodb.sock/project-management-test";

// Before all tests run, establish a connection to the test database.
beforeAll(async () => {
    await mongoose.connect(MONGODB_URI, {
        // Increase the server selection timeout to 30 seconds
        serverSelectionTimeoutMS: 60000 
    });
});

// After all tests have finished, clear the database and close the connection.
afterAll(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
    await mongoose.connection.close();
});

// Before each individual test, clear all data from all collections.
beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});
