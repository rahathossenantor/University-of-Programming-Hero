import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { Student } from "../student/student.model";
import { EnrolledCourse } from "./enrolledCourse.model";

// create enrolled course
const createEnrolledCourseIntoDB = async (studentId: string, payload: TEnrolledCourse) => {
    // is offered course exist
    const offeredCourse = await OfferedCourse.findById(payload.offeredCourse);
    if (!offeredCourse) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered course does not exist!");
    }

    // check the capacity
    if (!offeredCourse.maxCapacity) {
        throw new AppError(httpStatus.BAD_REQUEST, "Room is full!");
    }

    // check if the student is already enrolled
    const student = await Student.findOne({ id: studentId });
    const enrolledCourse = await EnrolledCourse.findOne({
        semesterRegistration: offeredCourse.semesterRegistration,
        offeredCourse: payload.offeredCourse,
        student: student?._id
    });
    if (enrolledCourse) {
        throw new AppError(httpStatus.CONFLICT, "Already enrolled!");
    }
};

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB
};
