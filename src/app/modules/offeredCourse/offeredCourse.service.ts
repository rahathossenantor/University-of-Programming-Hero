import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";

// create offered course
const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const dbRes = await OfferedCourse.create(payload);
    return dbRes;
};

export const OfferedCourseServices = {
    createOfferedCourseIntoDB
};
