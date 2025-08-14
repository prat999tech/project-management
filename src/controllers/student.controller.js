import { asyncHandler } from '../utils/asyncHandler.js';
import { apiresponse } from '../utils/apiresponse.js';
import { StudentService } from '../services/student.service.js';
import { StatusCodes } from 'http-status-codes';

const studentService = new StudentService();

const getStudentDashboard = asyncHandler(async (req, res) => {
    // req.user._id comes from the verifyJWT middleware
    const dashboardData = await studentService.getDashboard(req.user._id);
    
    return res
        .status(StatusCodes.OK)
        .json(new apiresponse(StatusCodes.OK, dashboardData, "Dashboard data fetched successfully"));
});

export { getStudentDashboard };
