/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { Student } from "../student/student.model";
import { EnrolledCourse } from "./enrolledCourse.model";
import mongoose from "mongoose";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { Course } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { calculateGradeAndPoints } from "./enrolledCourse.utils";

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
        throw new AppError(httpStatus.CONFLICT, "Already enrolled in this course!");
    }

    // check the capacity
    if (!offeredCourse.maxCapacity) {
        throw new AppError(httpStatus.BAD_REQUEST, "Max capacity is exeeded!");
    }

    // get semester registration
    const semesterRegistration = await SemesterRegistration.findById(offeredCourse.semesterRegistration);

    // get total enrolled credits
    const enrolledCoursesOfCurrentStudent = EnrolledCourse.aggregate([
        {
            $match: {
                semesterRegistration: semesterRegistration?._id,
                student: student?._id
            }
        },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "enrolledCourse"
            }
        },
        {
            $unwind: "$enrolledCourse"
        },
        {
            $group: {
                _id: null,
                totalEnrolledCredits: { $sum: "$enrolledCourse.credits" }
            }
        },
        {
            $project: {
                _id: 0,
                totalEnrolledCredits: 1
            }
        }
    ]);

    // check if the total credits exceeds the max credits
    const course = await Course.findById(offeredCourse.course);
    const totalEnrolledCredits = (await enrolledCoursesOfCurrentStudent).length > 0 ? (await enrolledCoursesOfCurrentStudent)[0].totalEnrolledCredits : 0;

    const maxCredits = semesterRegistration?.maxCredit;
    const currentCourseCredits = course?.credits;
    const grandTotalCredits = totalEnrolledCredits + currentCourseCredits;

    if (maxCredits && grandTotalCredits > maxCredits) {
        throw new AppError(httpStatus.BAD_REQUEST, "Total credits exceeded!");
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

// update enrolled course marks
const updateEnrolledCourseMarksIntoDB = async (facultyId: string, payload: Partial<TEnrolledCourse>) => {
    // is semester registration exist
    const semesterRegistration = await SemesterRegistration.findById(payload.semesterRegistration);
    if (!semesterRegistration) {
        throw new AppError(httpStatus.NOT_FOUND, "Semester registration does not exist!");
    }

    // is offered course exist
    const offeredCourse = await OfferedCourse.findById(payload.offeredCourse);
    if (!offeredCourse) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered course does not exist!");
    }

    // is student exist
    const student = await Student.findById(payload.student);
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, "Student does not exist!");
    }

    // is faculty exist
    const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });
    if (!faculty) {
        throw new AppError(httpStatus.NOT_FOUND, "Faculty does not exist!");
    }

    const enrolledCourse = await EnrolledCourse.findOne({
        semesterRegistration: payload.semesterRegistration,
        offeredCourse: payload.offeredCourse,
        student: payload.student,
        faculty: faculty._id
    });
    if (!enrolledCourse) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden access!");
    }

    // update course marks
    const modifiedData: Record<string, unknown> = {};
    const { courseMarks } = payload;

    if (courseMarks?.finalTerm) {
        const { classTest1, midTerm, classTest2, finalTerm } = courseMarks;
        const totalMarks =
            Math.ceil(classTest1 * 0.1) +
            Math.ceil(midTerm * 0.3) +
            Math.ceil(classTest2 * 0.1) +
            Math.ceil(finalTerm * 0.5);
        const { grade, points } = calculateGradeAndPoints(totalMarks);
        modifiedData.grade = grade;
        modifiedData.gradePoints = points;
        modifiedData.isCompleted = true;
    }

    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value;
        }
    }

    const dbRes = await EnrolledCourse.findByIdAndUpdate(
        enrolledCourse._id,
        modifiedData,
        { new: true }
    );
    return dbRes;
};

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    updateEnrolledCourseMarksIntoDB
};
