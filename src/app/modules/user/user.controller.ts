import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import httpStatus from "http-status";

// create student
const createStudent = catchAsync(async (req, res) => {
    const { password, student } = req.body;
    const dbRes = await UserServices.createStudentIntoDB(password, student);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Student is created successfully.",
        data: dbRes
    });
});

// create faculty
const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty } = req.body;
    const dbRes = await UserServices.createFacultyIntoDB(password, faculty);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Faculty is created successfully.",
        data: dbRes
    });
});

// create admin
const createAdmin = catchAsync(async (req, res) => {
    const { password, admin } = req.body;
    const dbRes = await UserServices.createAdminIntoDB(password, admin);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Admin is created successfully.",
        data: dbRes
    });
});

// get me
const getMe = catchAsync(async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        throw new AppError(httpStatus.NOT_FOUND, "Token does not found!");
    }
    const dbRes = await UserServices.getMe(token);

    res.status(httpStatus.OK).json({
        success: true,
        message: "My data retrived successfully.",
        data: dbRes
    });
});

export const UserControllers = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe
};
