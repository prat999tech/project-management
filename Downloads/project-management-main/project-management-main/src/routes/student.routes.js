import { Router } from 'express';
import { getStudentDashboard, createSubmission } from '../controllers/student.controller.js';
import { verifyJWT, isStudent } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// This route is protected. Only a logged-in user with the 'student' role can access it.
router.route('/dashboard').get(verifyJWT, isStudent, getStudentDashboard);
router.route('/submissions').post(
    upload.single('submissionFile'), // 'submissionFile' is the field name in the form-data
    createSubmission
);
export default router;
