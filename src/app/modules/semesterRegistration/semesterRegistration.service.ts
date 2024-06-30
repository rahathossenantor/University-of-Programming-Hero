/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";
import mongoose from "mongoose";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";

// create semester registration
const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
    // check is there any upcoming or ongoing semester
    const upcomingOrOngoingSemesterRegistration = await AcademicSemester.findOne({
        $or: [
            { status: "UPCOMING" },
            { status: "ONGOING" }
        ]
    });
    if (upcomingOrOngoingSemesterRegistration) {
        throw new AppError(httpStatus.BAD_REQUEST, `${upcomingOrOngoingSemesterRegistration} found!`);
    }

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

// update semster ragistration
const updateSemesterRegistrationIntoDB = async (id: string, payload: Partial<TSemesterRegistration>) => {
    const currentSemesterRegistration: TSemesterRegistration | null = await SemesterRegistration.findById(id);
    const currentStatus = currentSemesterRegistration?.status;
    const requestedStatus = payload?.status;

    if (currentStatus === "ENDED") {
        throw new AppError(httpStatus.BAD_REQUEST, "Semster ragistration is already ended!");
    } else if (currentStatus === "UPCOMING" && requestedStatus === "ENDED") {
        throw new AppError(httpStatus.BAD_REQUEST, `You canntot change status diractly from ${currentStatus} to ${requestedStatus}`);
    } else if (currentStatus === "ONGOING" && requestedStatus === "UPCOMING") {
        throw new AppError(httpStatus.BAD_REQUEST, `You canntot change status diractly from ${currentStatus} to ${requestedStatus}`);
    }

    const dbRes = await SemesterRegistration.findByIdAndUpdate(
        id,
        payload,
        { new: true, runValidators: true }
    );
    return dbRes;
};

// delete semester registration and it's courses
const deleteSemesterRegistrationFromDB = async (id: string) => {
    const isSemesterRegistrationExist = await SemesterRegistration.findById(id);
    if (!isSemesterRegistrationExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "This registered semester is not found!"
        );
    }

    // checking if the status is still "UPCOMING"
    const semesterRegistrationStatus = isSemesterRegistrationExist.status;
    if (semesterRegistrationStatus !== "UPCOMING") {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not delete this semester registration as it is ${semesterRegistrationStatus}`
        );
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const deletedOfferedCourses = await OfferedCourse.deleteMany(
            { semesterRegistration: id }, { session, new: true }
        );
        if (!deletedOfferedCourses) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Failed to delete semester registration!"
            );
        }

        const deletedSemisterRegistration = await SemesterRegistration.findByIdAndDelete(
            id,
            { session, new: true }
        );
        if (!deletedSemisterRegistration) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Failed to delete semester registration!"
            );
        }

        await session.commitTransaction();
        await session.endSession();
        return null;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB
};
