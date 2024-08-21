/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

const verifyToken = async (token: string, secret: string) => {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch (err: any) {
        throw new AppError(httpStatus.UNAUTHORIZED, err.message);
    }
};

export default verifyToken;
