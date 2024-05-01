import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.services";

// create an academic semester
const createAcademicSemester = catchAsync(async (req, res) => {
    const dbRes = await AcademicSemesterServices.createAcademicSemesterIntoDB(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Academic semester created.",
        data: dbRes
    });
});

// update academic semester by id
const updateAcademicSemester = catchAsync(async (req, res) => {
    const { academicSemesterId } = req.params;
    const dbRes = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
        academicSemesterId,
        req.body,
    );

    res.status(httpStatus.OK).json({
        success: true,
        message: "Academic semester is updated succesfully.",
        data: dbRes
    });
});

// get all academic semesters from the academic semesters collection
const getAllAcademicSemesters = catchAsync(async (req, res) => {
    const academicSemesters = await AcademicSemesterServices.getAllAcademicSemestersFromDB();

    res.status(httpStatus.OK).json({
        success: true,
        message: (academicSemesters.length ? "Academic semesters retrived successfully." : "No academic semester found!"),
        data: academicSemesters
    });
});

// get single academic semester from academic semesters collection
const getSingleAcademicSemester = catchAsync(async (req, res) => {
    const { academicSemesterId } = req.params;
    const academicSemester = await AcademicSemesterServices.getSingleAcademicSemesterFromDB(academicSemesterId);

    res.status(httpStatus.OK).json({
        success: true,
        message: (academicSemester ? "Academic semester data retrived successfully." : "No academic semester found!"),
        data: academicSemester
    });
});

export const AcademicSemesterControllers = {
    createAcademicSemester,
    updateAcademicSemester,
    getAllAcademicSemesters,
    getSingleAcademicSemester
};
