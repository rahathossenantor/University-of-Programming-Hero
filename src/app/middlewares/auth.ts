import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRoles } from "../modules/user/user.interface";

const auth = (...roles: TUserRoles[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized request!");
        }

        // check if the token is valid
        jwt.verify(token, config.jwt_access_secret as string, (err, decoded) => {
            if (err) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized request!");
            }
            if (roles && !roles.includes((decoded as JwtPayload).role)) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized request!");
            }

            req.user = decoded as JwtPayload;
            next();
        });
    });
};

export default auth;
