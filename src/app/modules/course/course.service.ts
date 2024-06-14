import { Course } from "./course.model";

// create a new course
const createCourseIntoDB = async () => {
    const dbRes = await Course.create();
    return dbRes;
};

// get all course
const getAllCoursesFromDB = async () => {
    const dbRes = await Course.find();
    return dbRes;
};

export const AdminServices = {
    createCourseIntoDB,
    getAllCoursesFromDB
};
