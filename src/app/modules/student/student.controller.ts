import { Request, Response } from "express";
import { StudentServices } from "./student.services";
import { TError } from "../../../app.interface";

const getAllStudents = async (req: Request, res: Response) => {
    try {
        const students = await StudentServices.getAllStudentsFromDB();
        res.status(200).json({
            success: true,
            message: "Students retrived successfully",
            data: students
        });
    } catch (err: unknown) {
        res.status(500).json({
            success: false,
            message: (err as TError).message || "Something went wrong!",
            error: err
        });
    }
};

const getSingleStudent = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const student = await StudentServices.getSingleStudentFromDB(studentId);
        res.status(200).json({
            success: true,
            message: "Student retrived successfully",
            data: student
        });
    } catch (err: unknown) {
        res.status(500).json({
            success: false,
            message: (err as TError).message || "Something went wrong!",
            error: err
        });
    }
};

const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const dbResponse = await StudentServices.deleteStudentFromDB(studentId);
        res.status(200).json({
            success: true,
            message: "Student retrived successfully",
            data: dbResponse
        });
    } catch (err: unknown) {
        res.status(500).json({
            success: false,
            message: (err as TError).message || "Something went wrong!",
            error: err
        });
    }
};

export const StudentControllers = {
    getAllStudents,
    getSingleStudent,
    deleteStudent
};
