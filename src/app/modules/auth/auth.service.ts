import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import bcrypt from "bcrypt";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
    // checking if the user is exist
    const user = await User.findOne({ id: payload.id });
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
    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, "Password does not matched!");
    }
    return payload;
};

export const AuthServices = {
    loginUser
};
