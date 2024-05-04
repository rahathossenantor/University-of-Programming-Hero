import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { generateStudentId } from "./user.utils";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import config from "../../config";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
    const userData: Partial<TUser> = {};
    userData.password = password || config.default_pass as string;
    userData.role = "student";

    // get academic semester data for generating student id
    const academicSemester = await AcademicSemester.findById(payload.academicSemester);
    userData.id = await generateStudentId(academicSemester as TAcademicSemester);

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        // create user
        const user = await User.create([userData], { session });
        if (!user.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user!");
        }
        payload.id = user[0].id;
        payload.user = user[0]._id;

        // create student
        const student = await Student.create([payload], { session });
        if (!student.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student!");
        }
        await session.commitTransaction();
        await session.endSession();

        return student;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error("Failed to create student!");
    }
};

export const UserServices = {
    createStudentIntoDB
};
