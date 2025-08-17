
/*import request from 'supertest';
import { app } from '../../src/app.js';
import { Department } from '../../src/models/department.model.js';
import { Project } from '../../src/models/project.model.js';
import { User } from '../../src/models/user.model.js';
import assert from 'assert';
import { test, describe, beforeEach } from 'node:test';

describe('Dashboard API Endpoints (Integration Tests)', () => {
    let teacherToken, studentToken;
    let studentId, teacherId;
    let testProject, testDepartment;

    beforeEach(async () => {
        try {
            // Create a department
            testDepartment = await Department.create({ name: 'Computer Science', code: 'CS' });

            // Register a teacher and a student
            const teacherUser = await User.create({
                username: 'prof_smith',
                email: 'smith@test.com',
                password: 'password',
                role: 'teacher',
                department: testDepartment._id
            });
            teacherId = teacherUser._id;

            const studentUser = await User.create({
                username: 'stud_jane',
                email: 'jane@test.com',
                password: 'password',
                role: 'student',
                department: testDepartment._id
            });
            studentId = studentUser._id;

            // Log them in to get their tokens
            const teacherLogin = await request(app)
                .post('/api/v1/users/login')
                .send({ email: 'smith@test.com', password: 'password' });
            teacherToken = teacherLogin.body.data.accessToken;

            const studentLogin = await request(app)
                .post('/api/v1/users/login')
                .send({ email: 'jane@test.com', password: 'password' });
            studentToken = studentLogin.body.data.accessToken;

            // Create a project linking the teacher and student
            testProject = await Project.create({
                title: 'Test Project',
                description: 'A test project for the dashboard',
                facultyadvisor: teacherId,
                students: [studentId],
                deadline: new Date(),
                department: testDepartment._id
            });
        } catch (err) {
            console.error('Error in beforeEach:', err);
            throw err;
        }
    });

    test('GET /api/v1/student/dashboard should return dashboard data for an authenticated student', async () => {
        try {
            const res = await request(app)
                .get('/api/v1/student/dashboard')
                .set('Authorization', `Bearer ${studentToken}`);
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.body.data.title, 'Test Project');
            assert.strictEqual(res.body.data.teacher.username, 'prof_smith');
            assert.strictEqual(res.body.data.groupMates[0].username, 'stud_jane');
        } catch (err) {
            console.error('Error in student dashboard test:', err);
            throw err;
        }
    });

    test('GET /api/v1/student/dashboard should return 403 Forbidden if a teacher tries to access it', async () => {
        try {
            const res = await request(app)
                .get('/api/v1/student/dashboard')
                .set('Authorization', `Bearer ${teacherToken}`);
            assert.strictEqual(res.statusCode, 403);
        } catch (err) {
            console.error('Error in student dashboard forbidden test:', err);
            throw err;
        }
    });

    test('GET /api/v1/teacher/dashboard should return an array of projects for an authenticated teacher', async () => {
        try {
            const res = await request(app)
                .get('/api/v1/teacher/dashboard')
                .set('Authorization', `Bearer ${teacherToken}`);
            assert.strictEqual(res.statusCode, 200);
            assert.ok(Array.isArray(res.body.data));
            assert.strictEqual(res.body.data.length, 1);
            assert.strictEqual(res.body.data[0].title, 'Test Project');
            assert.strictEqual(res.body.data[0].students[0].username, 'stud_jane');
        } catch (err) {
            console.error('Error in teacher dashboard test:', err);
            throw err;
        }
    });

    test('GET /api/v1/teacher/dashboard should return 403 Forbidden if a student tries to access it', async () => {
        try {
            const res = await request(app)
                .get('/api/v1/teacher/dashboard')
                .set('Authorization', `Bearer ${studentToken}`);
            assert.strictEqual(res.statusCode, 403);
        } catch (err) {
            console.error('Error in teacher dashboard forbidden test:', err);
            throw err;
        }
    });
});
*/
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app.js';
import { Department } from '../../src/models/department.model.js';
import { Project } from '../../src/models/project.model.js';
import { User } from '../../src/models/user.model.js';
import assert from 'assert';
import { test, describe, beforeEach, before, after } from 'node:test';

const MONGODB_URI = "mongodb+srv://pratik123:daksh123@cluster0.tbkavpl.mongodb.net/project-management-test";

describe('Dashboard API Endpoints (Integration Tests)', () => {
    // --- Start of Setup Logic ---
    before(async () => {
        try {
            // Establish the database connection before any tests run
            await mongoose.connect(MONGODB_URI);
            console.log("MongoDB connected for integration tests.");
        } catch (err) {
            console.error("Failed to connect to MongoDB for tests", err);
            process.exit(1); // Exit if DB connection fails
        }
    });

    after(async () => {
        // Disconnect after all tests are done
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
    });
    // --- End of Setup Logic ---

    let teacherToken, studentToken;
    let studentId, teacherId;
    let testProject, testDepartment;

    beforeEach(async () => {
        // Clear all collections before each test
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }

        // --- Create test data ---
        testDepartment = await Department.create({ name: 'Computer Science', code: 'CS' });

        const teacherUser = await User.create({
            username: 'prof_smith',
            email: 'smith@test.com',
            password: 'password',
            role: 'teacher',
            department: testDepartment._id
        });
        teacherId = teacherUser._id;

        const studentUser = await User.create({
            username: 'stud_jane',
            email: 'jane@test.com',
            password: 'password',
            role: 'student',
            department: testDepartment._id
        });
        studentId = studentUser._id;

        const teacherLogin = await request(app)
            .post('/api/v1/users/login')
            .send({ email: 'smith@test.com', password: 'password' });
        teacherToken = teacherLogin.body.data.accessToken;

        const studentLogin = await request(app)
            .post('/api/v1/users/login')
            .send({ email: 'jane@test.com', password: 'password' });
        studentToken = studentLogin.body.data.accessToken;

        testProject = await Project.create({
            title: 'Test Project',
            description: 'A test project for the dashboard',
            facultyadvisor: teacherId,
            students: [studentId],
            deadline: new Date(),
            department: testDepartment._id
        });
    });

    test('GET /api/v1/student/dashboard should return dashboard data for an authenticated student', async () => {
        const res = await request(app)
            .get('/api/v1/student/dashboard')
            .set('Authorization', `Bearer ${studentToken}`);
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.body.data.title, 'Test Project');
        assert.strictEqual(res.body.data.teacher.username, 'prof_smith');
    });

    test('GET /api/v1/student/dashboard should return 403 Forbidden if a teacher tries to access it', async () => {
        const res = await request(app)
            .get('/api/v1/student/dashboard')
            .set('Authorization', `Bearer ${teacherToken}`);
        assert.strictEqual(res.statusCode, 403);
    });

    test('GET /api/v1/teacher/dashboard should return an array of projects for an authenticated teacher', async () => {
        const res = await request(app)
            .get('/api/v1/teacher/dashboard')
            .set('Authorization', `Bearer ${teacherToken}`);
        assert.strictEqual(res.statusCode, 200);
        assert.ok(Array.isArray(res.body.data));
        assert.strictEqual(res.body.data.length, 1);
        assert.strictEqual(res.body.data[0].title, 'Test Project');
    });

    test('GET /api/v1/teacher/dashboard should return 403 Forbidden if a student tries to access it', async () => {
        const res = await request(app)
            .get('/api/v1/teacher/dashboard')
            .set('Authorization', `Bearer ${studentToken}`);
        assert.strictEqual(res.statusCode, 403);
    });
});