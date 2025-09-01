import { Router } from 'express';
import { 
    getTeacherDashboard,
    createProject,
    updateProject,
    deleteProject
} from '../controllers/teacher.controller.js';
import { verifyJWT, isTeacher } from '../middlewares/auth.middleware.js';

const router = Router();

// This middleware will be applied to all routes in this file.
// 1. `verifyJWT` checks if the user is logged in.
// 2. `isTeacher` checks if the logged-in user has the 'teacher' role.
router.use(verifyJWT, isTeacher);

// Dashboard route
router.route('/dashboard').get(getTeacherDashboard);

// Project management routes
router.route('/projects').post(createProject);

router.route('/projects/:id')
    .patch(updateProject)
    .delete(deleteProject);
    router.route('/submissions/:submissionId')
    .get(getSubmission)
    .patch(gradeSubmission);

export default router;