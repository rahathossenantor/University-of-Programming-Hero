import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { User } from "../modules/user/user.model";
import { TUser } from "../modules/user/user.interface";

const validateUser = async (id: string): Promise<TUser> => {
    // checking if the user is exist
    const user = await User.isUserExistByCustomId(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
    }

    // checking if the user is deleted
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, `This ${user.role} is deleted!`);
    }

    // checking if the user is blocked
    const userStatus = user?.status;
    if (userStatus === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, `This ${user.role} is ${userStatus}!`);
    }
    return user;
};

export default validateUser;
