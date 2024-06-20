import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";

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

// get all semster ragistrations
const getAllSemesterRegistrationsFromDB = async (query: Record<string, unknown>) => {
    const semsterRagistrationsQuery = new QueryBuilder(
        SemesterRegistration
            .find()
            .populate("academicSemester"),
        query
    )
        .filter()
        .sort()
        .paginate()
        .limitFields();

    const dbRes = await semsterRagistrationsQuery.modelQuery;
    return dbRes;
};

// get single semster ragistration
const getSingleSemesterRegistrationFromDB = async (id: string) => {
    const dbRes = await SemesterRegistration.findById(id).populate("academicSemester");

    if (!dbRes) {
        throw new AppError(httpStatus.NOT_FOUND, "Semster ragistration does not exist!");
    }
    return dbRes;
};

// update student
const updateSemesterRegistrationIntoDB = async (id: string, payload: Partial<TSemesterRegistration>) => {
    const dbRes = await SemesterRegistration.findByIdAndUpdate(
        id,
        payload,
        { new: true, runValidators: true }
    );
    return dbRes;
};

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB
};
