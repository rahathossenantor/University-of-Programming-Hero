/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import handleValidationError from "../errors/handleValidationError";
import handleZodError from "../errors/handleZodError";
import { TErrorSources } from "../interface/error";
import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import config from "../config";
import { ZodError } from "zod";
import handleCastError from "../errors/handleCastError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // default response data
    let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let message: string = err.message || "Something went wrong!";
    let errorSources: TErrorSources = [{
        path: "",
        message: "Something went wrong!"
    }];

    type TAssignErrorParam = typeof handleZodError | typeof handleValidationError | typeof handleCastError;

    const assignError = (errHandlerFn: TAssignErrorParam): void => {
        const simplifiedError = errHandlerFn(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
    };

    // handling errors
    if (err instanceof ZodError) {
        assignError(handleZodError);
    } else if (err?.name === "ValidationError") {
        assignError(handleValidationError);
    } else if (err?.name === "CastError") {
        assignError(handleCastError);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config.node_env === "development" ? err?.stack : null
    });
};

export default globalErrorHandler;
