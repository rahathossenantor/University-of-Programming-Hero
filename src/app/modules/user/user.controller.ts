import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student, password } = req.body;

        const dbResponse = await UserServices.createStudentIntoDB(password, student);

        res.status(200).json({
            success: true,
            message: "Student created successfully",
            data: dbResponse
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || "Something went wrong!",
            error: err
        });
    };
};

export const UserControllers = {
    createStudent
};
