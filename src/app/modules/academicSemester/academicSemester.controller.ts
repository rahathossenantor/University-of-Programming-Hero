import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.service";

// create an academic semester
const createAcademicSemester = catchAsync(async (req, res) => {
    const dbRes = await AcademicSemesterServices.createAcademicSemesterIntoDB(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Academic semester is created.",
        data: dbRes
    });
});

// update academic semester by id
const updateAcademicSemester = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
        id,
        req.body
    );

    res.status(httpStatus.OK).json({
        success: true,
        message: "Academic semester is updated succesfully.",
        data: dbRes
    });
});

// get all academic semesters
const getAllAcademicSemesters = catchAsync(async (req, res) => {
    const dbRes = await AcademicSemesterServices.getAllAcademicSemestersFromDB(req.query);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes.data.length ? "Academic semesters are retrived successfully." : "No academic semester found."),
        data: dbRes
    });
});

// get single academic semester
const getSingleAcademicSemester = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await AcademicSemesterServices.getSingleAcademicSemesterFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes ? "Academic semester is retrived successfully." : "No academic semester found!"),
        data: dbRes
    });
});

export const AcademicSemesterControllers = {
    createAcademicSemester,
    updateAcademicSemester,
    getAllAcademicSemesters,
    getSingleAcademicSemester
};
