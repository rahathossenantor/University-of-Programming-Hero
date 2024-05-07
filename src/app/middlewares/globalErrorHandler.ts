/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { ZodError, ZodIssue } from "zod";
import { TErrorSource } from "../interface/error";
import config from "../config";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let message: string = err.message || "Something went wrong!";
    let errorSources: TErrorSource = [{
        path: "",
        message: "Something went wrong!"
    }];

    const handleZodError = (err: ZodError) => {
        const errorSources: TErrorSource = err.issues.map((issue: ZodIssue) => {
            return {
                path: issue?.path[issue.path.length - 1],
                message: issue?.message
            };
        });
        const statusCode: number = 400;

        return {
            statusCode,
            message: "Validation error!",
            errorSources
        };
    };

    if (err instanceof ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config.node_env === "development" ? err?.stack : null
    });
};

export default globalErrorHandler;
