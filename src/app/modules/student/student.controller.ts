import { NextFunction, Request, Response } from "express";
import { StudentServices } from "./student.services";
import httpStatus from "http-status";

// get all students from students collection
const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const students = await StudentServices.getAllStudentsFromDB();
        res.status(httpStatus.OK).json({
            success: true,
            message: "Students retrived successfully",
            data: students
        });
    } catch (err: unknown) {
        next(err);
    }
};

// get single student from students collection
const getSingleStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { studentId } = req.params;
        const student = await StudentServices.getSingleStudentFromDB(studentId);
        res.status(httpStatus.OK).json({
            success: true,
            message: (student ? "Student retrived successfully" : "No student found!"),
            data: student
        });
    } catch (err: unknown) {
        next(err);
    }
};

// delete single student from students collection
const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { studentId } = req.params;
        const dbResponse = await StudentServices.deleteStudentFromDB(studentId);
        res.status(httpStatus.OK).json({
            success: true,
            message: "Student retrived successfully",
            data: dbResponse
        });
    } catch (err: unknown) {
        next(err);
    }
};

export const StudentControllers = {
    getAllStudents,
    getSingleStudent,
    deleteStudent
};
