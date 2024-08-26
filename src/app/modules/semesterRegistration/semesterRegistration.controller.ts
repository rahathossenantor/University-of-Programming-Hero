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

// get all semester registrations
const getAllSemesterRegistrations = catchAsync(async (req, res) => {
    const dbRes = await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(req.query);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Semester registrations are retrived successfully.",
        data: dbRes
    });
});

// get single semester registration
const getSingleSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes ? "Semester registration is retrived successfully." : "No semester registration found!"),
        data: dbRes
    });
});

// update semester registration
const updateSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(id, req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Semester registration is updated succesfully.",
        data: dbRes
    });
});

// delete semester registration
const deleteSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await SemesterRegistrationServices.deleteSemesterRegistrationFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Semester registration is deleted successfully.",
        data: dbRes
    });
});

export const SemesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemesterRegistrations,
    getSingleSemesterRegistration,
    updateSemesterRegistration,
    deleteSemesterRegistration
};
