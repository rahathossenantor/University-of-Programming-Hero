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

// get all academic semesters from the academic semesters collection
const getAllAcademicSemesters = catchAsync(async (req, res) => {
    const academicSemesters = await AcademicSemesterServices.getAllAcademicSemestersFromDB();

    res.status(httpStatus.OK).json({
        success: true,
        message: "Academic semesters retrived successfully",
        data: academicSemesters
    });
});

export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcademicSemesters
};
