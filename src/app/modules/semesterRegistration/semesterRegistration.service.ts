import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";

// create semester registration
const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
    // check is academic semester is exist or not
    const academicSemester = payload?.academicSemester;
    const isAcademicSemesterExist = await AcademicSemester.findById(academicSemester);
    if (!isAcademicSemesterExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Academic semester does not exist!");
    }

    // check is semester registration is exist or not
    const isSemesterRegistrationExist = await SemesterRegistration.findOne({ academicSemester });
    if (isSemesterRegistrationExist) {
        throw new AppError(httpStatus.CONFLICT, "Semester registration is already exist!");
    }

    const dbRes = await SemesterRegistration.create(payload);
    return dbRes;
};

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB
};