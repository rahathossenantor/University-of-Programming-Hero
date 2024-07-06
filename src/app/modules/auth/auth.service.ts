/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import config from "../../config";
import bcrypt from "bcrypt";
import validateUser from "../../utils/validateUser";

const loginUser = async (payload: TLoginUser) => {
    // validate the user
    const user = await validateUser(payload.id);

    // checking if the password is correct
    if (!await User.isPasswordMatched(payload.password, user.password)) {
        throw new AppError(httpStatus.FORBIDDEN, "Password does not matched!");
    }

    // create jwt token and sent to the client
    const jwtPayload = {
        id: user.id,
        role: user.role
    };

    const accessToken = jwt.sign(
        jwtPayload,
        config.jwt_access_secret as string,
        { expiresIn: "10d" }
    );

    return {
        accessToken,
        needsPasswordChange: user.needsPasswordChange
    };
};

const changePassword = async (
    userData: JwtPayload,
    payload: { oldPassword: string, newPassword: string }
) => {
    // validate the user
    const user = await validateUser(userData.id);
    
    // checking if the password is correct
    if (!await User.isPasswordMatched(payload.oldPassword, user.password)) {
        throw new AppError(httpStatus.FORBIDDEN, "Password does not matched!");
    }

    // hashing new password
    const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));

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

export const AuthServices = {
    loginUser,
    changePassword
};
