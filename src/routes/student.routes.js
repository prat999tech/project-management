import { Router } from 'express';
import { getStudentDashboard } from '../controllers/student.controller.js';
import { verifyJWT, isStudent } from '../middlewares/auth.middleware.js';

const router = Router();

// This route is protected. Only a logged-in user with the 'student' role can access it.
router.route('/dashboard').get(verifyJWT, isStudent, getStudentDashboard);

export default router;
