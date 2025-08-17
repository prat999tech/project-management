import { ProjectRepository } from '../repositories/project.repository.js';

class TeacherService {
    constructor() {
        this.projectRepository = new ProjectRepository();
    }

    /**
     * @description Orchestrates fetching all dashboard data for a teacher.
     * @param {string} teacherId - The logged-in teacher's ID.
     */
    async getDashboard(teacherId) {
        const dashboardData = await this.projectRepository.getTeacherDashboardData(teacherId);
        // It's not an error if the array is empty, it just means the teacher has no projects.
        return dashboardData;
    }
}

export { TeacherService };
