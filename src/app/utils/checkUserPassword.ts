import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { User } from "../modules/user/user.model";

const checkUserPassword = async (plainTextPass: string, hasPass: string) => {
    if (!await User.isPasswordMatched(plainTextPass, hasPass)) {
        throw new AppError(httpStatus.FORBIDDEN, "Password does not matched!");
    }
};

export default checkUserPassword;
