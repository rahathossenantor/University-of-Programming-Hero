import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { generateStudentId, generateFacultyId } from "./user.utils";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import config from "../../config";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

// create student
const createStudentIntoDB = async (password: string, payload: TStudent) => {
    const userData: Partial<TUser> = {};
    userData.password = password || config.default_pass as string;
    userData.role = "student";

    // get academic semester data for generating student id
    const academicSemester = await AcademicSemester.findById(payload.academicSemester);
    
    if (!academicSemester) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic semester does not found!");
  }
    
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

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {};
    userData.password = password || config.default_pass as string;
    userData.role = "faculty";

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic department does not found!");
  }
  
  userData.id = await generateFacultyId();

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

// create faculty
    const faculty = await Faculty.create([payload], { session });

    if (!faculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create faculty!");
    }

    await session.commitTransaction();
    await session.endSession();

    return faculty;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("Failed to create faculty!");
  }
};

export const UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB
};
