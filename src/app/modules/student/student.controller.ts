import { NextFunction, Request, Response } from "express";
import { StudentServices } from "./student.services";

const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const students = await StudentServices.getAllStudentsFromDB();
        res.status(200).json({
            success: true,
            message: "Students retrived successfully",
            data: students
        });
    } catch (err: unknown) {
        next(err);
    }
};

const getSingleStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { studentId } = req.params;
        const student = await StudentServices.getSingleStudentFromDB(studentId);
        res.status(200).json({
            success: true,
            message: "Student retrived successfully",
            data: student
        });
    } catch (err: unknown) {
        next(err);
    }
};

const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { studentId } = req.params;
        const dbResponse = await StudentServices.deleteStudentFromDB(studentId);
        res.status(200).json({
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
