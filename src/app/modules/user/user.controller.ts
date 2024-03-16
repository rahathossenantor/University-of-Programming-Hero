import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.services";
import httpStatus from "http-status";

// create new student in students collection
const createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, student } = req.body;
        const dbResponse = await UserServices.createStudentIntoDB(password, student);
        res.status(httpStatus.OK).json({
            success: true,
            message: "Student created successfully",
            data: dbResponse
        });
    } catch (err: unknown) {
        next(err);
    }
};

export const UserControllers = {
    createStudent
};
