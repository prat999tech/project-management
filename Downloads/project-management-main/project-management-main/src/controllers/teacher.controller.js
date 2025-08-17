import { asyncHandler } from '../utils/asyncHandler.js';
import { apiresponse } from '../utils/apiresponse.js';
import { TeacherService } from '../services/teacher.service.js';
import { StatusCodes } from 'http-status-codes';

const teacherService = new TeacherService();

const getTeacherDashboard = asyncHandler(async (req, res) => {
    // req.user._id is securely provided by the verifyJWT middleware.
    const dashboardData = await teacherService.getDashboard(req.user._id);
    
    return res
        .status(StatusCodes.OK)
        .json(new apiresponse(StatusCodes.OK, dashboardData, "Teacher dashboard data fetched successfully"));
});

export { getTeacherDashboard };
