/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import { TErrorSources } from "../interface/error";
import config from "../config";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // default response data
    let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let message: string = err.message || "Something went wrong!";
    let errorSources: TErrorSources = [{
        path: "",
        message: "Something went wrong!"
    }];

    const assignError = (error, errHandlerFn) => {
        const simplifiedError = errHandlerFn(error);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
    };

    // handling errors
    if (err instanceof ZodError) {
        assignError(err, handleZodError);
    } else if (err?.name === "ValidationError") {
        assignError(err, handleValidationError);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config.node_env === "development" ? err?.stack : null,
        // error: err
    });
};

export default globalErrorHandler;
