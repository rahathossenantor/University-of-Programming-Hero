import QueryBuilder from "../../builder/QueryBuilder";
import { Admin } from "./admin.model";
import { TAdmin } from "./admin.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { User } from "../user/user.model";

// get all admins
const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminSearchableFields: string[] = ["id", "name.firstName", "name.middleName", "name.lastName", "email", "contactNo", "emergencyContactNo"];
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(adminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const dbRes = await adminQuery.modelQuery;
  return dbRes;
};

// get single admin
const getSingleAdminFromDB = async (id: string) => {
  const dbRes = await Admin.findById(id);

  if (!dbRes) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin does not exist!");
  }
  return dbRes;
};

// update admin
const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingAdminData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const dbRes = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return dbRes;
};

// delete admin
const deleteAdminFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );
    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete admin!");
    }

    const userId = deletedAdmin.user;
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
    return deletedAdmin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("Failed to delete admin!");
  }
};

export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB
};
