import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";
import httpStatus from "http-status";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
    console.log("zooood", err);
    const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
        return {
            path: issue?.path[issue.path.length - 1],
            message: issue?.message
        };
    });
    const statusCode: number = httpStatus.BAD_REQUEST;

    return {
        statusCode,
        message: "Validation error!",
        errorSources
    };
};

export default handleZodError;
