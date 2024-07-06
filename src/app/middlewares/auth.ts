import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRoles } from "../modules/user/user.interface";
import validateUser from "../utils/validateUser";
import { User } from "../modules/user/user.model";

const auth = (...roles: TUserRoles[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized request!");
        }

        // check if the token is valid
        const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;

        // validate the user
        const user = await validateUser(decoded.id);

        if (
            user.passwordChangedAt &&
            User.isJWTIssuedBeforePasswordChange( user.passwordChangedAt, decoded.iat as number )
        ) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized request!");
        }
        
        if (roles && !roles.includes(decoded.role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized request!");
        }

        req.user = decoded;
        next();
    });
};

export default auth;
