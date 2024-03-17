import { StudentServices } from "./student.services";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

// get all students from students collection
const getAllStudents = catchAsync(async (req, res) => {
    const students = await StudentServices.getAllStudentsFromDB();
    res.status(httpStatus.OK).json({
        success: true,
        message: "Students retrived successfully",
        data: students
    });
});

// get single student from students collection
const getSingleStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const student = await StudentServices.getSingleStudentFromDB(studentId);
    res.status(httpStatus.OK).json({
        success: true,
        message: (student ? "Student retrived successfully" : "No student found!"),
        data: student
    });
});

// delete single student from students collection
const deleteStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const dbResponse = await StudentServices.deleteStudentFromDB(studentId);
    res.status(httpStatus.OK).json({
        success: true,
        message: "Student retrived successfully",
        data: dbResponse
    });
});

export const StudentControllers = {
    getAllStudents,
    getSingleStudent,
    deleteStudent
};
