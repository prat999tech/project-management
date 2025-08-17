import { ProjectRepository } from '../repositories/project.repository.js';
import { apierror } from '../utils/apierror.js';

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
}

export { StudentService };
