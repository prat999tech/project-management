// test/setup.js

import mongoose from 'mongoose';

// Connect to the test database provided by the IDX environment
const MONGODB_URI = "mongodb://localhost:27017/project-management-test";

// Before all tests, establish the connection
beforeAll(async () => {
    await mongoose.connect(MONGODB_URI);
});

// After each test, clear all collections to ensure a clean state
beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

// After all tests have run, close the connection
afterAll(async () => {
    await mongoose.connection.close();
});