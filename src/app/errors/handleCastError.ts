import httpStatus from "http-status";
import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    const statusCode: number = httpStatus.BAD_REQUEST;
    const errorSources: TErrorSources = [{
        path: err?.path,
        message: err?.message
    }];

    return {
        statusCode,
        message: "Invalid ID!",
        errorSources
    };
};

export default handleCastError;
