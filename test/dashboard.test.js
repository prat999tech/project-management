import request from 'supertest';
import { app } from '../src/app.js';
import { StatusCodes } from 'http-status-codes';
import { Department } from '../src/models/department.model.js';
import { Project } from '../src/models/project.model.js';

describe('Dashboard API Endpoints', () => {
    let teacherToken, studentToken;
    let studentId, teacherId;
    let testProject, testDepartment;

    // --- SETUP: Before running tests, create all necessary data ---
    beforeEach(async () => {
        // 1. Create a department
        testDepartment = await Department.create({ name: 'Computer Science', code: 'CS' });
        
        // 2. Register a teacher and a student
        const teacherRes = await request(app).post('/api/v1/users/register').send({
            username: 'prof_smith', email: 'smith@test.com', password: 'password', role: 'teacher', department: 'CS'
        });
        teacherId = teacherRes.body.data._id;
        
        const studentRes = await request(app).post('/api/v1/users/register').send({
            username: 'stud_jane', email: 'jane@test.com', password: 'password', role: 'student', department: 'CS'
        });
        studentId = studentRes.body.data._id;

        // 3. Log them in to get their tokens
        const teacherLogin = await request(app).post('/api/v1/users/login').send({ email: 'smith@test.com', password: 'password' });
        teacherToken = teacherLogin.body.data.accessToken;

        const studentLogin = await request(app).post('/api/v1/users/login').send({ email: 'jane@test.com', password: 'password' });
        studentToken = studentLogin.body.data.accessToken;

        // 4. Create a project linking the teacher and student
        testProject = await Project.create({
            title: 'Test Project',
            description: 'A test project for the dashboard',
            facultyadvisor: teacherId,
            students: [studentId],
            deadline: new Date(),
            department: testDepartment._id
        });
    });

    // --- Student Dashboard Tests ---
    describe('GET /api/v1/student/dashboard', () => {
        it('should return dashboard data for an authenticated student', async () => {
            const res = await request(app)
                .get('/api/v1/student/dashboard')
                .set('Authorization', `Bearer ${studentToken}`); // Use the token

            expect(res.statusCode).toBe(StatusCodes.OK);
            expect(res.body.data.title).toBe('Test Project');
            expect(res.body.data.teacher.username).toBe('prof_smith');
        });

        it('should return 403 Forbidden if a teacher tries to access it', async () => {
            const res = await request(app)
                .get('/api/v1/student/dashboard')
                .set('Authorization', `Bearer ${teacherToken}`); // Using the wrong role's token

            expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
        });
    });

    // --- Teacher Dashboard Tests ---
    describe('GET /api/v1/teacher/dashboard', () => {
        it('should return an array of projects for an authenticated teacher', async () => {
            const res = await request(app)
                .get('/api/v1/teacher/dashboard')
                .set('Authorization', `Bearer ${teacherToken}`);
            
            expect(res.statusCode).toBe(StatusCodes.OK);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].title).toBe('Test Project');
        });

        it('should return 403 Forbidden if a student tries to access it', async () => {
             const res = await request(app)
                .get('/api/v1/teacher/dashboard')
                .set('Authorization', `Bearer ${studentToken}`); // Using the wrong role's token

            expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
        });
    });
});
