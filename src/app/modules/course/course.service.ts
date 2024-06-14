import { Course } from "./course.model";

// create a new course
const createCourseIntoDB = async () => {
    const dbRes = await Course.create();
    return dbRes;
};

export const AdminServices = {
    createCourseIntoDB
};
