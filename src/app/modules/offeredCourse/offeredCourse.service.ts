/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { Course } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { Types } from "mongoose";
import { hasTimeConfliction } from "./offeredCourse.utils";

// create offered course
const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const {
        semesterRegistration,
        academicDepartment,
        academicFaculty,
        course,
        faculty,
        section,
        days,
        startTime,
        endTime
    } = payload;

    const checkField = async (fieldModel: any, id: Types.ObjectId, fieldName: string) => {
        const field = await fieldModel.findById(id);
        if (!field) {
            throw new AppError(httpStatus.NOT_FOUND, `${fieldName} does not exist!`);
        }
        return field;
    };

    const semesterReg = await checkField(SemesterRegistration, semesterRegistration, "Semester registration");
    const academicSemester = semesterReg.academicSemester;
    const acadmcDepartment = await checkField(AcademicDepartment, academicDepartment, "Academic department");
    const acadmcFaculty = await checkField(AcademicFaculty, academicFaculty, "Academic faculty");
    await checkField(Course, course, "Course");
    await checkField(Faculty, faculty, "Faculty");

    // is the faculty belongs to the department
    const isTheFacultyBelongsToTheDepartment = await AcademicDepartment.findOne({
        _id: academicDepartment,
        academicFaculty
    });
    if (!isTheFacultyBelongsToTheDepartment) {
        throw new AppError(httpStatus.BAD_REQUEST, `${acadmcFaculty?.name} is not belongs to The ${acadmcDepartment?.name}!`);
    }

    // is the course already exist with same section
    const isTheCourseAlreadyExistWithSameSection = await OfferedCourse.findOne({
        semesterRegistration,
        course,
        section
    });
    if (isTheCourseAlreadyExistWithSameSection) {
        throw new AppError(httpStatus.BAD_REQUEST, "This course is already exist in this section with the same registered semester!");
    }

    // get the schedules of the faculties
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days }
    }, {
        days: 1,
        startTime: 1,
        endTime: 1
    });
    const newSchedule = {
        days,
        startTime,
        endTime
    };

    if (hasTimeConfliction(assignedSchedules, newSchedule)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `This faculty is not available at that time! Choose other time or day.`
        );
    }

    const dbRes = await OfferedCourse.create({ ...payload, academicSemester });
    return dbRes;
};

// update offered course
const updateOfferedCourseIntoDB = async (
    id: string,
    payload: Pick<TOfferedCourse, "faculty" | "maxCapacity" | "days" | "startTime" | "endTime">
) => {
    const { faculty, days, startTime, endTime } = payload;

    // is offered course exist
    const isOfferedCourseExist = await OfferedCourse.findById(id);
    if (!isOfferedCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered course does not exist!");
    }
    const semesterRegistration = isOfferedCourseExist.semesterRegistration;

    // check the status of the offered course
    const semesterReg = await SemesterRegistration.findById(semesterRegistration).select("status");
    if (semesterReg?.status !== "UPCOMING") {
        throw new AppError(httpStatus.NOT_FOUND, `Cannot be updated as it is ${semesterReg?.status}`);
    }

    // is faculty exist
    const isFacultyExists = await Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Faculty does not exist!");
    }

    // get the schedules of the faculties
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days }
    }, {
        days: 1,
        startTime: 1,
        endTime: 1
    });
    const newSchedule = {
        days,
        startTime,
        endTime
    };

    if (hasTimeConfliction(assignedSchedules, newSchedule)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `This faculty is not available at that time! Choose other time or day.`
        );
    }

    // update offered course
    const dbRes = await OfferedCourse.findByIdAndUpdate(
        id,
        payload,
        {
            new: true,
            runValidators: true
        }
    );
    return dbRes;
};

// get all offered courses
const getAllOfferedCoursesFromDB = async () => {
    const dbRes = await OfferedCourse.find();
    return dbRes;
};

// get single offered course
const getSingleOfferedCourseFromDB = async (id: string) => {
    const dbRes = await OfferedCourse.findById(id);
    return dbRes;
};

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    updateOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB
};
