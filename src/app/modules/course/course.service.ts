import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Course } from "./course.model";

// create a new course
const createCourseIntoDB = async () => {
    const dbRes = await Course.create();
    return dbRes;
};

// get all courses
const getAllCoursesFromDB = async () => {
    const dbRes = await Course.find();
    return dbRes;
};

// get single course
const getSingleCourseFromDB = async (id: string) => {
    const dbRes = await Course.findById(id);

    if (!dbRes) {
        throw new AppError(httpStatus.NOT_FOUND, "Course does not exist!");
    }
    return dbRes;
};

// delete course
const deleteCourseFromDB = async (id: string) => {
    const dbRes = await Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return dbRes;
};

export const AdminServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    deleteCourseFromDB
};
