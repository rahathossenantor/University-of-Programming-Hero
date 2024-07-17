/* eslint-disable @typescript-eslint/no-explicit-any */
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { TFaculty } from "../faculty/faculty.interface";
import { TAdmin } from "../admin/admin.interface";
import { Student } from "../student/student.model";
import { Faculty } from "../faculty/faculty.model";
import { Admin } from "../admin/admin.model";
import { generateStudentId, generateFacultyId, generateAdminId } from "./user.utils";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import config from "../../config";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { JwtPayload } from "jsonwebtoken";
import uploadImage from "../../utils/uploadImage";

// create admin
const createAdminIntoDB = async (password: string, imagePath: string, payload: TAdmin) => {
  const userData: Partial<TUser> = {};
  userData.password = password || config.default_pass as string;
  userData.role = "admin";
  userData.email = payload.email;
  userData.id = await generateAdminId();

  if (imagePath) {
    // upload image to cloudinary
    const uploadRes: any = await uploadImage(imagePath, `admin-${userData.id}`);
    payload.avatar = uploadRes?.secure_url;
  }

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

    // create admin
    const admin = await Admin.create([payload], { session });

    if (!admin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin!");
    }

    await session.commitTransaction();
    await session.endSession();
    return admin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("Failed to create admin!");
  }
};

// create faculty
const createFacultyIntoDB = async (password: string, imagePath: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {};
  userData.password = password || config.default_pass as string;
  userData.role = "faculty";
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic department does not found!");
  }
  payload.academicFaculty = academicDepartment.academicFaculty;

  userData.id = await generateFacultyId();

  if (imagePath) {
    // upload image to cloudinary
    const uploadRes: any = await uploadImage(imagePath, `faculty-${userData.id}`);
    payload.avatar = uploadRes?.secure_url;
  }

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

// create student
const createStudentIntoDB = async (password: string, imagePath: string, payload: TStudent) => {
  const userData: Partial<TUser> = {};
  userData.password = password || config.default_pass as string;
  userData.role = "student";
  userData.email = payload.email;

  // get academic semester data for generating student id
  const academicSemester = await AcademicSemester.findById(payload.academicSemester);
  if (!academicSemester) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic semester does not found!");
  }

  // get academic department
  const academicDepartment = await AcademicDepartment.findById(payload.academicDepartment);
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic department does not found!");
  }
  payload.academicFaculty = academicDepartment.academicFaculty;

  userData.id = await generateStudentId(academicSemester as TAcademicSemester);

  if (imagePath) {
    // upload image to cloudinary
    const uploadRes: any = await uploadImage(imagePath, `student-${userData.id}`);
    payload.avatar = uploadRes?.secure_url;
  }

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

// get me
const getMe = async (user: JwtPayload) => {
  const { id, role } = user;
  let dbRes = null;

  if (role === "admin") {
    dbRes = await Admin.findOne({ id });
  } else if (role === "faculty") {
    dbRes = await Faculty.findOne({ id }).populate("academicDepartment");
  } else if (role === "student") {
    dbRes = await Student.findOne({ id })
      .populate("academicSemester")
      .populate(
        {
          path: "academicDepartment",
          populate: { path: "academicFaculty" }
        }
      );
  }
  return dbRes;
};

// update user status
const updateUserStatus = async (id: string, payload: { status: string }) => {
  // checking if the user is exist
  const user = await User.isUserExist(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }

  const dbRes = await User.findByIdAndUpdate(id, payload, { new: true });
  return dbRes;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  updateUserStatus,
  getMe
};
