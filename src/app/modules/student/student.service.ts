import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { TGuardian, TParents, TStudent } from "./student.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";
import { TName } from "../../interface/global.interface";

// get all students
const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    const studentsQuery = new QueryBuilder(
        Student.find()
            .populate("academicSemester")
            .populate({
                path: "academicDepartment",
                populate: { path: "academicFaculty" },
            }),
        query
    )
        .search(studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .limitFields();

    const dbRes = await studentsQuery.modelQuery;
    const meta = await studentsQuery.countTotal();
    return {
        data: dbRes,
        meta
    };
};

// get single student
const getSingleStudentFromDB = async (id: string) => {
    const dbRes = await Student.findById(id)
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

// update student
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
    const { name, parents, guardian, ...remainingStudentData } = payload;
    const modifiedStudentData: Record<string, unknown> = {
        ...remainingStudentData
    };

    const changeValues = (data: TName | TParents | TGuardian | undefined, name: string): void => {
        if (data && Object.keys(data).length) {
            for (const [key, value] of Object.entries(data)) {
                modifiedStudentData[`${name}.${key}`] = value;
            }
        }
    };
    changeValues(name, "name");
    changeValues(parents, "parents");
    changeValues(guardian, "guardian");

    const dbRes = await Student.findByIdAndUpdate(
        id,
        modifiedStudentData,
        { new: true, runValidators: true }
    );
    return dbRes;
};

// delete student
const deleteStudentFromDB = async (id: string) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // delete student
        const deletedStudent = await Student.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true, session }
        );
        if (!deletedStudent) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student!");
        }

        // delete user
        const userId = deletedStudent.user;
        const deletedUser = await User.findByIdAndUpdate(
            userId,
            { isDeleted: true },
            { new: true, session }
        );
        if (!deletedUser) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user!");
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
    updateStudentIntoDB,
    deleteStudentFromDB
};
