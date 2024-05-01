import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./user.services";
import httpStatus from "http-status";

// create new student in students collection
const createStudent = catchAsync(async (req, res) => {
    const { password, student } = req.body;
    const dbRes = await UserServices.createStudentIntoDB(password, student);
    
    res.status(httpStatus.OK).json({
        success: true,
        message: "Student is created successfully.",
        data: dbRes
    });
});

export const UserControllers = {
    createStudent
};
