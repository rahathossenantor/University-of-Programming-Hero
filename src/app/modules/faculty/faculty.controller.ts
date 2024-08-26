import { FacultyServices } from "./faculty.service";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

// get all faculties
const getAllFaculties = catchAsync(async (req, res) => {
    const dbRes = await FacultyServices.getAllFacultiesFromDB(req.query);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes.data.length ? "Faculties are retrived successfully." : "No faculty found!"),
        data: dbRes
    });
});

// get single faculty
const getSingleFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await FacultyServices.getSingleFacultyFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes ? "Faculty is retrived successfully." : "No faculty found!"),
        data: dbRes
    });
});

// update faculty
const updateFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { faculty } = req.body;
    const dbRes = await FacultyServices.updateFacultyIntoDB(id, faculty);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Faculty is updated succesfully.",
        data: dbRes
    });
});

// delete single faculty
const deleteFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await FacultyServices.deleteFacultyFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Faculty is deleted successfully.",
        data: dbRes
    });
});

export const FacultyControllers = {
    getAllFaculties,
    getSingleFaculty,
    updateFaculty,
    deleteFaculty
};
