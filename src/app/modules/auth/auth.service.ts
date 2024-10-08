/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import config from "../../config";
import jwt from "jsonwebtoken";
import validateUser from "../../utils/validateUser";
import { createToken } from "./auth.utils";
import { TUser } from "../user/user.interface";
import sendEmail from "../../utils/sendEmail";
import checkUserPassword from "../../utils/checkUserPassword";
import hashPassword from "../../utils/hashPassword";
import verifyToken from "../../utils/verifyToken";

// login user
const loginUser = async (payload: TLoginUser) => {
    // check if the user is valid
    const user: TUser = await validateUser(payload.id);
    await checkUserPassword(payload.password, user.password);

    // create jwt token
    const jwtPayload = {
        id: user.id,
        role: user.role
    };
    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);
    const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string);

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user.needsPasswordChange
    };
};

// change user password
const changePassword = async (
    userData: JwtPayload,
    payload: { oldPassword: string, newPassword: string }
) => {
    // check if the user is valid
    const user: TUser = await validateUser(userData.id);
    await checkUserPassword(payload.oldPassword, user.password);

    // hashing new password
    const newHashedPassword = await hashPassword(payload.newPassword);

    await User.findOneAndUpdate({
        id: userData.id,
        role: userData.role
    }, {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date()
    });
    return null;
};

// get access token by refresh token
const getAccessTokenByRefreshToken = async (refreshToken: string) => {
    // check if the token is valid
    const decoded = await verifyToken(refreshToken, config.jwt_refresh_secret as string);

    // check if the user is valid
    const user: TUser = await validateUser(decoded.id);

    if (
        user.passwordChangedAt &&
        User.isJWTIssuedBeforePasswordChange(user.passwordChangedAt, decoded.iat as number)
    ) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized request!");
    }

    // create jwt token
    const jwtPayload = {
        id: user.id,
        role: user.role
    };
    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);
    
    return {
        accessToken
    };
};

// forget password
const forgetPassword = async (id: string) => {
    // check if the user is valid
    const user: TUser = await validateUser(id);

    // create jwt token and reset link
    const jwtPayload = {
        id: user.id,
        role: user.role
    };
    const resetToken = createToken(jwtPayload, config.jwt_access_secret as string, "10m");
    const resetLink: string = `${config.reset_password_url}?user=${user.id}&token=${resetToken}`;
    
    await sendEmail(user.email, resetLink);
    return {
        resetToken
    };
};

// reset password
const resetPassword = async (payload: {id: string, newPassword: string}, token: string) => {
    // check if the user is valid
    await validateUser(payload.id);
    const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
    if (payload.id !== decoded.id) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden!");
    }

    const newHashedPassword = await hashPassword(payload.newPassword);
    await User.findOneAndUpdate({
        id: decoded.id,
        role: decoded.role
    }, {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date()
    });
    return null
};

export const AuthServices = {
    loginUser,
    changePassword,
    getAccessTokenByRefreshToken,
    forgetPassword,
    resetPassword
};
