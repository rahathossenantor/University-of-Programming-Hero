import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { TGuardian, TName, TParents, TStudent } from "./student.interface";

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    const filterQueries = { ...query };
    const excludedFields: string[] = ["searchTerm", "sort", "limit"];
    excludedFields.forEach(field => delete filterQueries[field]);

    // search partially
    const searchTerm: string = query.searchTerm as string || "";
    const partialSearchRes = Student.find({
        $or: ["name.firstName", "email"].map(field => (
            {
                [field]: { $regex: searchTerm, $options: "i" }
            }
        ))
    });

    // filter students
    const filteredRes = partialSearchRes.find(filterQueries)
        .populate("academicSemester")
        .populate(
            {
                path: "academicDepartment",
                populate: { path: "academicFaculty" }
            }
        );

    // sort students
    let sort: string = "-createdAt";
    if (query.sort) {
        sort = query.sort as string;
    }
    const sortedRes = filteredRes.sort(sort);

    // limit students
    let limit: number = 1;
    if (query.limit) {
        limit = Number(query.limit);
    }
    const limitedRes = await sortedRes.limit(limit);
    const dbRes = limitedRes;
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

    const dbRes = await Student.findOneAndUpdate(
        { id },
        modifiedStudentData,
        { new: true, runValidators: true }
    );
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
    updateStudentIntoDB,
    deleteStudentFromDB
};
