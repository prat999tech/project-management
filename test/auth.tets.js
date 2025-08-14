import request from 'supertest';
import { app } from '../src/app.js';
import { StatusCodes } from 'http-status-codes';
import { publishMessage } from '../src/mq/rabbitmq.js'; // Import the original function

// --- Mocking RabbitMQ ---
// We tell Jest: "Anywhere in the code where 'publishMessage' is imported,
// use our fake function instead." This lets us spy on it.
jest.mock('../src/mq/rabbitmq.js', () => ({
    ...jest.requireActual('../src/mq/rabbitmq.js'), // Import actual parts we don't want to mock
    publishMessage: jest.fn(), // This is our fake, spy function
}));

describe('User Authentication API (/api/v1/users)', () => {
    
    describe('POST /register', () => {

        it('should register a new user, return user data, AND publish a welcome email message', async () => {
            // Arrange
            const newUser = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                role: 'student',
                department: 'Computer Science'
            };

            // Act
            const response = await request(app)
                .post('/api/v1/users/register')
                .send(newUser);

            // Assert - Part 1: Check the API Response
            expect(response.statusCode).toBe(StatusCodes.CREATED);
            expect(response.body.data.username).toBe('testuser');
            expect(response.body.data.password).toBeUndefined(); // Ensure password is not returned

            // Assert - Part 2: Check the Notification
            expect(publishMessage).toHaveBeenCalledTimes(1);
            expect(publishMessage).toHaveBeenCalledWith(
                'email_notifications', // The correct queue
                expect.objectContaining({ // The correct message payload
                    email: 'test@example.com',
                    type: 'WELCOME_EMAIL'
                })
            );
        });

        it('should NOT publish a message if registration fails', async () => {
            // Arrange (Missing password)
            const badUser = { username: 'baduser', email: 'bad@test.com' };

            // Act
            await request(app).post('/api/v1/users/register').send(badUser);

            // Assert
            expect(publishMessage).not.toHaveBeenCalled();
        });
    });

    // You would add similar tests for login, password change, etc.
});
