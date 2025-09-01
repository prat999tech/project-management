import { Submission } from '../models/submission.model.js';
import { CrudRepository } from './CrudRepository.js';
import mongoose from 'mongoose';

class SubmissionRepository extends CrudRepository {
    constructor() {
        super(Submission);
    }

    async getSubmissionWithDetails(submissionId) {
        const submissionObjectId = new mongoose.Types.ObjectId(submissionId);
        const submission = await Submission.aggregate([
            { $match: { _id: submissionObjectId } },
            {
                $lookup: {
                    from: "projects",
                    localField: "project",
                    foreignField: "_id",
                    as: "projectInfo"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "student",
                    foreignField: "_id",
                    as: "studentInfo"
                }
            },
            { $unwind: "$projectInfo" },
            { $unwind: "$studentInfo" },
            {
                $project: {
                    _id: 1,
                    fileUrl: 1,
                    status: 1,
                    grade: 1,
                    feedback: 1,
                    submittedAt: 1,
                    project: {
                        _id: "$projectInfo._id",
                        title: "$projectInfo.title",
                        facultyAdvisor: "$projectInfo.facultyAdvisor"
                    },
                    student: {
                        _id: "$studentInfo._id",
                        username: "$studentInfo.username",
                        email: "$studentInfo.email"
                    }
                }
            }
        ]);

        return submission.length > 0 ? submission[0] : null;
    }
}

export { SubmissionRepository };