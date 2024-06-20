import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { SemesterRegistrationServices } from "./semesterRegistration.service";

// create semester registration
const createSemesterRegistration = catchAsync(async (req, res) => {
    const dbRes = await SemesterRegistrationServices.createSemesterRegistrationIntoDB(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Semester registration is created.",
        data: dbRes
    });
});

// get all students from students collection
const getAllSemesterRegistrations = catchAsync(async (req, res) => {
    const dbRes = await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(req.query);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes.length ? "Semester registrations are retrived successfully." : "No semester registration found!"),
        data: dbRes
    });
});

// get single student from students collection
const getSingleSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes ? "Semester registration is retrived successfully." : "No semester registration found!"),
        data: dbRes
    });
});

export const SemesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemesterRegistrations,
    getSingleSemesterRegistration
};
