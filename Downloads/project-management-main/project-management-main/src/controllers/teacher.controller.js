import { asyncHandler } from '../utils/asyncHandler.js';
import { apiresponse } from '../utils/apiresponse.js';
import { TeacherService } from '../services/teacher.service.js';
import { StatusCodes } from 'http-status-codes';
import { apierror } from '../utils/apierror.js';

const teacherService = new TeacherService();

const getTeacherDashboard = asyncHandler(async (req, res) => {
    // req.user._id is securely provided by the verifyJWT middleware.
    const dashboardData = await teacherService.getDashboard(req.user._id);
    
    return res
        .status(StatusCodes.OK)
        .json(new apiresponse(StatusCodes.OK, dashboardData, "Teacher dashboard data fetched successfully"));
});
const createProject=asyncHandler(async(req,res)=>{
const {title, description, deadline, department} = req.body;
if(!title || !description || !deadline || !department){
    throw new apierror(400,"All fields are required");
}
const project=await teacherService.createProject(req.body, req.user._id);
return res
    .status(StatusCodes.CREATED)
    .json(new apiresponse(StatusCodes.CREATED, project, "Project created successfully"));
});
const updateProject=asyncHandler(async(req,res)=>{
const {title, description, deadline, department} = req.body;
if(!title || !description || !deadline || !department){
    throw new apierror(400,"All fields are required");
}
const project=await teacherService.updateProject(req.params.id, req.body, req.user._id);
return res
    .status(StatusCodes.OK)
    .json(new apiresponse(StatusCodes.OK, project, "Project updated successfully"));
});
const deleteProject=asyncHandler(async(req,res)=>{
    const deletedProject = await teacherService.deleteProject(req.params.id, req.user._id);
    return res
        .status(StatusCodes.OK)
        .json(new apiresponse(StatusCodes.OK, deletedProject, "Project deleted successfully"));
});
const getSubmission=asyncHandler(async(req,res)=>{
    const {submissionId}= req.params;
    const teacherId= req.user._id;
    const submission= await teacherService.getSubmissionDetails(submissionId, teacherId);
    return res
        .status(StatusCodes.OK)
        .json(new apiresponse(StatusCodes.OK, submission, "Submission fetched successfully"));
});
const gradeSubmission=asyncHandler(async(req,res)=>{
    const {submissionId}= req.params;
    const teacherId= req.user._id;
    const {grade, feedback, status}= req.body;
    if(grade===undefined || !feedback || !status){
        throw new apierror(400, "All fields are required");
    }
    const updatedSubmission= await teacherService.gradeSubmission(submissionId, req.body, teacherId);
    return res
        .status(StatusCodes.OK)
        .json(new apiresponse(StatusCodes.OK, updatedSubmission, "Submission graded successfully"));
});



export { getTeacherDashboard, createProject, updateProject, deleteProject, getSubmission, gradeSubmission };
