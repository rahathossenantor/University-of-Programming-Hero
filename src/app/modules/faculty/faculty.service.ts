import QueryBuilder from "../../builder/QueryBuilder";
import { Faculty } from "./faculty.model";
import { TFaculty } from "./faculty.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { User } from "../user/user.model";
import { facultySearchableFields } from "./faculty.constant";

// get all faculties
const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultiesQuery = new QueryBuilder(
    Faculty.find()
      .populate("user")
      .populate("academicFaculty")
      .populate("academicDepartment"),
    query
  )
    .search(facultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const dbRes = await facultiesQuery.modelQuery;
  const meta = await facultiesQuery.countTotal();

  return {
    data: dbRes,
    meta
  };
};

// get single faculty
const getSingleFacultyFromDB = async (id: string) => {
  const dbRes = await Faculty.findById(id).populate("academicDepartment");

  if (!dbRes) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty does not exist!");
  }
  return dbRes;
};

// update faculty
const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingFacultyData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const dbRes = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return dbRes;
};

// delete faculty
const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );
    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete faculty!");
    }

    const userId = deletedFaculty.user;
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user!");
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedFaculty;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("Failed to delete faculty!");
  }
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB
};
