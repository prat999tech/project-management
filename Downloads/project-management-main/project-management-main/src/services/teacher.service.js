import { ProjectRepository } from '../repositories/project.repository.js';
import { apierror } from '../utils/apierror.js';
import { redisClient } from '../db/redis.db.js';
import { apierror } from '../utils/apierror.js';
import { SubmissionRepository } from '../repositories/submission.repository.js';

class TeacherService {
    constructor() {
        this.projectRepository = new ProjectRepository();
        this.submissionRepository = new SubmissionRepository();
    }

    /**
     * @description Orchestrates fetching all dashboard data for a teacher.
     * @param {string} teacherId - The logged-in teacher's ID.
     */
    async getDashboard(teacherId) {
        const cacheKey = `teacher-dashboard-${teacherId}`;
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        const dashboardData = await this.projectRepository.getTeacherDashboardData(teacherId);
        // It's not an error if the array is empty, it just means the teacher has no projects.
        await redisClient.set(cacheKey, JSON.stringify(dashboardData));
        return dashboardData;
    }
     async createProject(projectData, teacherId){
            
                projectData.facultyAdvisor= teacherId;
                const newProject= await this.projectRepository.create(projectData);
                const cacheKey = `teacher-dashboard:${teacherId}`;
                await redisClient.del(cacheKey);
                return newProject;

           
               
            
        }
        async deleteProject(projectId, teacherId){
             const project = await this.projectRepository.get(projectId);
        if (!project) {
            throw new apierror(404, "Project not found");
        }

        // 2. SECURITY CHECK: Ensure the teacher owns the project
        if (project.facultyAdvisor.toString() !== teacherId.toString()) {
            throw new apierror(403, "Forbidden: You are not authorized to delete this project");
        }
                const deletedProject = await this.projectRepository.destroy(projectId);
               
                const cacheKey = `teacher-dashboard:${teacherId}`;
                await redisClient.del(cacheKey);
                return deletedProject;

          
        }
        async updateProject(projectId, projectData, teacherId){
             const project = await this.projectRepository.get(projectId);
        if (!project) {
            throw new apierror(404, "Project not found");
        }
        if (project.facultyAdvisor.toString() !== teacherId.toString()) {
            throw new apierror(403, "Forbidden: You are not authorized to update this project");
        }
            const updatedProject=await this.projectRepository.update(projectId, projectData);


         const cacheKey = `teacher-dashboard:${teacherId}`;
          await redisClient.del(cacheKey);
        return updatedProject;

    
}
async getSubmissionDetails(submissionId, teacherId) {
        const submission = await this.submissionRepository.getSubmissionWithDetails(submissionId);

        if (!submission) {
            throw new apierror(404, "Submission not found.");
        }

        if (submission.project.facultyAdvisor.toString() !== teacherId.toString()) {
            throw new apierror(403, "You are not authorized to view this submission.");
        }

        return submission;
    }
    async gradeSubmission(submissionId, gradeData, teacherId) {
        const { grade, feedback, status } = gradeData;

        const submission = await this.submissionRepository.getSubmissionWithDetails(submissionId);
        if (!submission) {
            throw new apierror(404, "Submission not found.");
        }

        if (submission.project.facultyAdvisor.toString() !== teacherId.toString()) {
            throw new apierror(403, "You are not authorized to grade this submission.");
        }

        const updatedSubmission = await this.submissionRepository.update(submissionId, {
            grade,
            feedback,
            status
        });

        // --- Start of Redis Implementation ---
        // 2. Invalidate the teacher's dashboard cache because its data is now stale.
        const cacheKey = `teacher-dashboard:${teacherId}`;
        await redisClient.del(cacheKey);
        // --- End of Redis Implementation ---

        return updatedSubmission;
    }


}
export { TeacherService };
