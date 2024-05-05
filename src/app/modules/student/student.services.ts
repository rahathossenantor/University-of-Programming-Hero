import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";

const getAllStudentsFromDB = async () => {
    const dbRes = await Student.find()
        .populate("academicSemester")
        .populate(
            {
                path: "academicDepartment",
                populate: { path: "academicFaculty" }
            }
        );
    return dbRes;
};

const getSingleStudentFromDB = async (id: string) => {
    const dbRes = await Student.findOne({ id, isDeleted: { $ne: true } })
        .populate("academicSemester")
        .populate(
            {
                path: "academicDepartment",
                populate: { path: "academicFaculty" }
            }
        );

    if (!dbRes) {
        throw new AppError(httpStatus.NOT_FOUND, "Student does not exist!");
    }
    return dbRes;
};

const deleteStudentFromDB = async (id: string) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // delete user
        const deletedUser = await User.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session }
        );
        if (!deletedUser) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user!");
        }
        // delete student
        const deletedStudent = await Student.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session }
        );
        if (!deletedStudent) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student!");
        }

        await session.commitTransaction();
        await session.endSession();
        return deletedStudent;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error("Failed to delete student!");
    }
};

export const StudentServices = {
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    deleteStudentFromDB
};
