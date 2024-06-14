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
    return dbRes;
};

export const AdminServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB
};
