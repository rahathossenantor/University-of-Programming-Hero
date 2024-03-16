/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (err: any, req: Request, res: Response) => {
    const statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    const message: string = err.message || "Something went wrong!";

    return res.status(statusCode).json({
        success: false,
        message,
        error: err
    });
};

export default globalErrorHandler;
