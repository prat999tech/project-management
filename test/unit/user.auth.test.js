// test/unit/user.auth.test.js

import request from 'supertest';
import { app } from '../../src/app.js';
import { StatusCodes } from 'http-status-codes';
import { publishMessage } from '../../src/mq/rabbitmq.js';
import { User } from '../../src/models/user.model.js'; // Import the model to mock it

// --- Mocking Dependencies ---
jest.mock('../../src/mq/rabbitmq.js', () => ({
    publishMessage: jest.fn(),
}));

// MOCK THE ENTIRE USER MODEL TO AVOID DATABASE CONNECTION
jest.mock('../../src/models/user.model.js', () => ({
    // Use the `__esModule: true` and `default` pattern if using ES Modules with named exports
    __esModule: true,
    User: {
        // Mock the User.create() static method
        create: jest.fn(),
    },
}));

describe('User Authentication API (Unit Tests)', () => {
    
    describe('POST /api/v1/users/register', () => {
        // Reset mocks before each test to ensure a clean state
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should register a new user, return user data, AND publish a welcome email message', async () => {
            // Arrange
            const newUser = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                role: 'student',
                department: 'Computer Science'
            };
            const mockCreatedUser = { ...newUser, _id: 'mocked-user-id', save: jest.fn() };

            // Tell the mock function what to return when it's called
            User.create.mockResolvedValue(mockCreatedUser);

            // Act
            const response = await request(app)
                .post('/api/v1/users/register')
                .send(newUser);

            // Assert - Part 1: Check the API Response
            expect(response.statusCode).toBe(StatusCodes.CREATED);
            expect(response.body.data.username).toBe('testuser');
            expect(response.body.data.password).toBeUndefined(); // Ensure password is not returned

            // Assert - Part 2: Check the Mocks
            expect(User.create).toHaveBeenCalledTimes(1);
            expect(publishMessage).toHaveBeenCalledTimes(1);
            expect(publishMessage).toHaveBeenCalledWith(
                'email_notifications',
                expect.objectContaining({
                    email: 'test@example.com',
                    type: 'WELCOME_EMAIL'
                })
            );
        });

        it('should NOT publish a message if registration fails', async () => {
            // Arrange: Simulate a database validation error
            User.create.mockRejectedValue(new Error('Validation failed'));
            
            const badUser = { username: 'baduser', email: 'bad@test.com' };

            // Act
            const response = await request(app).post('/api/v1/users/register').send(badUser);

            // Assert
            expect(response.statusCode).not.toBe(StatusCodes.CREATED);
            expect(publishMessage).not.toHaveBeenCalled();
            expect(User.create).toHaveBeenCalledTimes(1);
        });
    });
});