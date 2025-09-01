import { Project } from '../models/project.model.js';
import { CrudRepository } from './CrudRepository.js';
import mongoose from 'mongoose';

class ProjectRepository extends CrudRepository {
    constructor() {
        super(Project);
    }

    /**
     * @description Fetches all projects and their related data for a specific teacher.
     * This is the core query for the teacher dashboard.
     * @param {string} teacherId - The ID of the faculty advisor.
     * @returns {Promise<Array>} An array of project data.
     */
    async getTeacherDashboardData(teacherId) {
        const teacherObjectId = new mongoose.Types.ObjectId(teacherId);

        const dashboardData = await Project.aggregate([
            // Stage 1: Find all projects where the current user is the faculty advisor.
            {
                $match: { facultyadvisor: teacherObjectId }
            },
            // Optional: Sort projects by the nearest deadline first.
            {
                $sort: { deadline: 1 }
            },
            // Stage 2: Look up the details for all students assigned to each project.
            {
                $lookup: {
                    from: "users",
                    localField: "students",
                    foreignField: "_id",
                    pipeline: [{ $project: { password: 0, refreshtoken: 0, role: 0 } }],
                    as: "assignedStudents"
                }
            },
            // Stage 3: Look up the 5 most recent submissions for each project to show an activity feed.
            {
                $lookup: {
                    from: "submissions",
                    localField: "_id",
                    foreignField: "project",
                    pipeline: [
                        { $sort: { createdAt: -1 } },
                        { $limit: 5 }
                    ],
                    as: "recentSubmissions"
                }
            },
            // Stage 4: Clean up the output for a predictable and clean API response.
            {
                $project: {
                    _id: 1,
                    title: 1,
                    status: 1,
                    priority: 1,
                    deadline: 1,
                    students: "$assignedStudents",
                    submissions: "$recentSubmissions"
                }
            }
        ]);

        return dashboardData;
    }

    // The getProjectDetailsForStudent method for the student dashboard would also be here...
    async getProjectDetailsForStudent(studentId) {
        const studentObjectId = new mongoose.Types.ObjectId(studentId);

        const projectData = await Project.aggregate([
            { $match: { students: studentObjectId } },
            {
                $lookup: {
                    from: "users",
                    localField: "facultyadvisor",
                    foreignField: "_id",
                    pipeline: [{ $project: { _id: 1, username: 1, email: 1, department: 1 } }],
                    as: "teacherInfo"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "students",
                    foreignField: "_id",
                    pipeline: [{ $project: { _id: 1, username: 1, email: 1 } }],
                    as: "groupMates"
                }
            },
            {
                $lookup: {
                    from: "meetings",
                    localField: "_id",
                    foreignField: "project",
                    as: "projectMeetings"
                }
            },
            {
                $lookup: {
                    from: "submissions",
                    localField: "_id",
                    foreignField: "project",
                    as: "projectSubmissions"
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    status: 1,
                    deadline: 1,
                    teacher: { $first: "$teacherInfo" },
                    groupMates: 1,
                    meetings: "$projectMeetings",
                    submissions: "$projectSubmissions"
                }
            }
        ]);
        
        return projectData.length > 0 ? projectData[0] : null;
    }
   
}

export { ProjectRepository };
