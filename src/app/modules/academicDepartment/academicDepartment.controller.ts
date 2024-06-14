import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicDepartmentServices } from "./academicDepartment.service";

// create an academic department
const createAcademicDepartment = catchAsync(async (req, res) => {
    const dbRes = await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Academic department is created.",
        data: dbRes
    });
});

// update academic department by id
const updateAcademicDepartment = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
        id,
        req.body
    );

    res.status(httpStatus.OK).json({
        success: true,
        message: "Academic department is updated succesfully.",
        data: dbRes
    });
});

// get all academic departments
const getAllAcademicDepartments = catchAsync(async (req, res) => {
    const dbRes = await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB();

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes.length ? "Academic departments are retrived successfully." : "No academic department found!"),
        data: dbRes
    });
});

// get single academic department
const getSingleAcademicDepartment = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes ? "Academic department is retrived successfully." : "No academic department found!"),
        data: dbRes
    });
});

export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    updateAcademicDepartment,
    getAllAcademicDepartments,
    getSingleAcademicDepartment
};
