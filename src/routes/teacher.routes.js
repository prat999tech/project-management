import { Router } from 'express';
import { getTeacherDashboard } from '../controllers/teacher.controller.js';
import { verifyJWT, isTeacher } from '../middlewares/auth.middleware.js';

const router = Router();

// This route is protected and isolated for teachers.
// 1. `verifyJWT` checks if the user is logged in.
// 2. `isTeacher` checks if the logged-in user has the 'teacher' role.
router.route('/dashboard').get(verifyJWT, isTeacher, getTeacherDashboard);

export default router;
