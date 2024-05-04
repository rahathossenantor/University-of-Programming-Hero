import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    const message: string = err.message || "Something went wrong!";

    return res.status(statusCode).json({
        success: false,
        message,
        error: err
    });
};

export default globalErrorHandler;
