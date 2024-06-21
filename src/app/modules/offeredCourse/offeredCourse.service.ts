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

// create offered course
const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const {
        semesterRegistration,
        academicDepartment,
        academicFaculty,
        course,
        faculty
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

    await checkField(AcademicDepartment, academicDepartment, "Academic department");
    await checkField(AcademicFaculty, academicFaculty, "Academic faculty");
    await checkField(Course, course, "Course");
    await checkField(Faculty, faculty, "Faculty");

    const dbRes = await OfferedCourse.create({ ...payload, academicSemester });
    return dbRes;
};

export const OfferedCourseServices = {
    createOfferedCourseIntoDB
};
