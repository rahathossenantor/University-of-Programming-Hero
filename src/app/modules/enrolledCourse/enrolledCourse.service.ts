import { TEnrolledCourse } from "./enrolledCourse.interface";

// create enrolled course
const createEnrolledCourseIntoDB = async (studentId: string, payload: TEnrolledCourse) => {
    console.log(studentId);
    console.log(payload);
};

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB
};
