import httpStatus from "http-status";
import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
    const statusCode: number = httpStatus.BAD_REQUEST;
    const errorSources: TErrorSources = Object.values(err.errors).map(
        (errObj: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return {
                path: errObj?.path,
                message: errObj?.message
            };
        }
    );

    return {
        statusCode,
        message: "Validation error!",
        errorSources
    };
};

export default handleValidationError;
