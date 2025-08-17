import assert from 'assert';
import { test, describe, beforeEach } from 'node:test';
import { UserService } from '../../src/services/user.service.js';

describe('UserService (Unit Tests)', () => {
    let publishMessageCalls;
    let mockPublishMessage;
    let mockUserRepository;
    let userService;

    beforeEach(() => {
        publishMessageCalls = [];
        mockPublishMessage = (queue, payload) => publishMessageCalls.push({ queue, payload });
        mockUserRepository = {
            findByEmailOrUsername: async (email, username) => null,
            create: async (user) => ({ ...user, _id: 'mocked-user-id' }),
            findbyid: async (id) => ({ username: 'testuser', email: 'test@example.com', _id: id })
        };
        userService = new UserService({
            userRepository: mockUserRepository,
            publishMessage: mockPublishMessage
        });
    });

    test('registerUser should create user and publish welcome message', async () => {
        const newUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            role: 'student',
            department: 'Computer Science'
        };
        const createdUser = await userService.registerUser(newUser);
        assert.strictEqual(createdUser.username, 'testuser');
        assert.strictEqual(publishMessageCalls.length, 1);
        assert.strictEqual(publishMessageCalls[0].queue, 'email_notifications');
        assert.strictEqual(publishMessageCalls[0].payload.email, 'test@example.com');
        assert.strictEqual(publishMessageCalls[0].payload.type, 'WELCOME_EMAIL');
    });

    test('registerUser should throw error if fields are missing', async () => {
        await assert.rejects(
            () => userService.registerUser({ username: '', email: '', password: '', role: '', department: '' }),
            /All fields are required/
        );
        assert.strictEqual(publishMessageCalls.length, 0);
    });

    test('registerUser should throw error if user exists', async () => {
        mockUserRepository.findByEmailOrUsername = async () => ({ username: 'testuser' });
        await assert.rejects(
            () => userService.registerUser({ username: 'testuser', email: 'test@example.com', password: 'password123', role: 'student', department: 'Computer Science' }),
            /User with email or username already exists/
        );
        assert.strictEqual(publishMessageCalls.length, 0);
    });
});