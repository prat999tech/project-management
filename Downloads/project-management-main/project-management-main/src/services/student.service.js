import { ProjectRepository } from '../repositories/project.repository.js';
import { apierror, apierror } from '../utils/apierror.js';
import { SubmissionRepository } from '../repositories/submission.repository.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import { redisClient } from '../db/redis.db.js';


class StudentService {
    constructor() {
        this.projectRepository = new ProjectRepository();
    }

    /**
     * @description Orchestrates fetching all dashboard data for a student.
     * @param {string} studentId - The logged-in student's ID.
     */
    async getDashboard(studentId) {
        const dashboardData = await this.projectRepository.getProjectDetailsForStudent(studentId);
        
        if (!dashboardData) {
            throw new apierror(404, "You are not assigned to any project yet.");
        }
        
        return dashboardData;
    }
       async createSubmission(studentId, localFilePath) {
        // The repository method returns an array, so we need to handle it as such
        const projectDetailsArray = await this.projectRepository.getProjectDetailsForStudent(studentId);
        if (!projectDetailsArray || projectDetailsArray.length === 0) {
            throw new apierror(404, "You are not assigned to any project.");
        }
        const project = projectDetailsArray[0]; // Get the first project from the array

        if (!localFilePath) {
            throw new apierror(400, "Submission file is required.");
        }

        const submissionFile = await uploadOnCloudinary(localFilePath);
        if (!submissionFile || !submissionFile.url) {
            throw new apierror(500, "Failed to upload submission file.");
        }

        const newSubmission = await this.submissionRepository.create({
            project: project._id,
            student: studentId,
            fileUrl: submissionFile.url,
        });

        // 2. Invalidate the teacher's dashboard cache
        // The teacher's info is available from the project details we fetched earlier
        const teacherId = project.teacher?._id;
        if (teacherId) {
            const cacheKey = `teacher-dashboard:${teacherId}`;
            await redisClient.del(cacheKey);
        }

        return newSubmission;
    }

       
}



export { StudentService };
