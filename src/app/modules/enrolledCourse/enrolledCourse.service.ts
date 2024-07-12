/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { Student } from "../student/student.model";
import { EnrolledCourse } from "./enrolledCourse.model";
import mongoose from "mongoose";

// create enrolled course
const createEnrolledCourseIntoDB = async (studentId: string, payload: TEnrolledCourse) => {
    // is offered course exist
    const offeredCourse = await OfferedCourse.findById(payload.offeredCourse);
    if (!offeredCourse) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered course does not exist!");
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

    // check the capacity
    if (!offeredCourse.maxCapacity) {
        throw new AppError(httpStatus.BAD_REQUEST, "Room is full!");
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const dbRes = await EnrolledCourse.create([{
            semesterRegistration: offeredCourse.semesterRegistration,
            academicSemester: offeredCourse.academicSemester,
            academicFaculty: offeredCourse.academicFaculty,
            academicDepartment: offeredCourse.academicDepartment,
            offeredCourse: payload.offeredCourse,
            course: offeredCourse.course,
            student: student?._id,
            faculty: offeredCourse.faculty,
            isEnrolled: true
        }], { session });
        if (!dbRes.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to enroll the course!");
        }

        // update max capacity of offered course
        await OfferedCourse.findByIdAndUpdate(payload.offeredCourse, {
            maxCapacity: offeredCourse.maxCapacity - 1
        });

        await session.commitTransaction();
        await session.endSession();
        return dbRes;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB
};
