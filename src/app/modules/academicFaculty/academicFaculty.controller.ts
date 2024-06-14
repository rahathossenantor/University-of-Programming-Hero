import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicFacultyServices } from "./academicFaculty.service";

// create an academic faculty
const createAcademicFaculty = catchAsync(async (req, res) => {
    const dbRes = await AcademicFacultyServices.createAcademicFacultyIntoDB(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Academic faculty is created.",
        data: dbRes
    });
});

// update academic faculty by id
const updateAcademicFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await AcademicFacultyServices.updateAcademicFacultyIntoDB(
        id,
        req.body
    );

    res.status(httpStatus.OK).json({
        success: true,
        message: "Academic faculty is updated succesfully.",
        data: dbRes
    });
});

// get all academic faculties
const getAllAcademicFaculties = catchAsync(async (req, res) => {
    const dbRes = await AcademicFacultyServices.getAllAcademicFacultiesFromDB();

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes.length ? "Academic faculties are retrived successfully." : "No academic faculty found!"),
        data: dbRes
    });
});

// get single academic faculty
const getSingleAcademicFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes ? "Academic faculty is retrived successfully." : "No academic faculty found!"),
        data: dbRes
    });
});

export const AcademicFacultyControllers = {
    createAcademicFaculty,
    updateAcademicFaculty,
    getAllAcademicFaculties,
    getSingleAcademicFaculty
};
