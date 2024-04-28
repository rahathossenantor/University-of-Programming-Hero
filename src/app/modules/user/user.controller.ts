import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./user.services";
import httpStatus from "http-status";

// create new student in students collection
const createStudent = catchAsync(async (req, res) => {
    const { password, student } = req.body;
    const dbResponse = await UserServices.createStudentIntoDB(password, student);
    
    res.status(httpStatus.OK).json({
        success: true,
        message: "Student created successfully",
        data: dbResponse
    });
});

export const UserControllers = {
    createStudent
};
