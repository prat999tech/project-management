import { asyncHandler } from '../utils/asyncHandler.js';
import { apiresponse } from '../utils/apiresponse.js';
import { StudentService } from '../services/student.service.js';
import { StatusCodes } from 'http-status-codes';
import { apierror } from '../utils/apierror.js';

const studentService = new StudentService();

const getStudentDashboard = asyncHandler(async (req, res) => {
    // req.user._id comes from the verifyJWT middleware
    const dashboardData = await studentService.getDashboard(req.user._id);
    
    return res
        .status(StatusCodes.OK)
        .json(new apiresponse(StatusCodes.OK, dashboardData, "Dashboard data fetched successfully"));
});
const createSubmission=asyncHandler(async(req,res)=>{
    const studentid=req.user._id;
    const localfieldpath= req.file?.path;
    if(!localfieldpath){
        throw new apierror(400, "Submission file is required.");
    }
    const submission= await studentService.createSubmission(studentid, localfieldpath);
    return res
        .status(StatusCodes.CREATED)
        .json(new apiresponse(StatusCodes.CREATED, submission, "Submission created successfully"));
});
export { getStudentDashboard, createSubmission };
