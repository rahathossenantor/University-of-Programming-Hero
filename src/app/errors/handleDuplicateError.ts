import httpStatus from "http-status";
import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    const statusCode: number = httpStatus.BAD_REQUEST;
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    const errorSources: TErrorSources = [{
        path: "",
        message: `${extractedMessage} is already exists!`
    }];

    return {
        statusCode,
        message: `${extractedMessage} is already exists!`,
        errorSources
    };
};

export default handleDuplicateError;
