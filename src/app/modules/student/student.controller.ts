import { StudentServices } from "./student.services";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

// get all students from students collection
const getAllStudents = catchAsync(async (req, res) => {
    const dbRes = await StudentServices.getAllStudentsFromDB();

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes.length ? "Students are retrived successfully." : "No student found!"),
        data: dbRes
    });
});

// get single student from students collection
const getSingleStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const dbRes = await StudentServices.getSingleStudentFromDB(studentId);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes ? "Student is retrived successfully." : "No student found!"),
        data: dbRes
    });
});

// delete single student from students collection
const deleteStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const dbRes = await StudentServices.deleteStudentFromDB(studentId);
    
    res.status(httpStatus.OK).json({
        success: true,
        message: "Student is deleted successfully.",
        data: dbRes
    });
});

export const StudentControllers = {
    getAllStudents,
    getSingleStudent,
    deleteStudent
};
