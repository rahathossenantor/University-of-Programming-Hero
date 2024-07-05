import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import jwt from "jsonwebtoken";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import config from "../../config";

const loginUser = async (payload: TLoginUser) => {
    // checking if the user is exist
    const user = await User.isUserExistByCustomId(payload.id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
    }

    // checking if the user is already deleted
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
    }

    // checking if the user is blocked
    const userStatus = user?.status;
    if (userStatus === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
    }

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

export const AuthServices = {
    loginUser
};
