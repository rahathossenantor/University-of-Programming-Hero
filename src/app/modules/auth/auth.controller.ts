import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import config from "../../config";

// login user
const loginUser = catchAsync(async (req, res) => {
    const dbRes = await AuthServices.loginUser(req.body);
    const { refreshToken } = dbRes;
    res.cookie("refreshToken", refreshToken, { secure: config.node_env === "production" })

    res.status(httpStatus.OK).json({
        success: true,
        message: "Login succesfull.",
        data: dbRes
    });
});

// change password
const changePassword = catchAsync(async (req, res) => {
    await AuthServices.changePassword(req.user, req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Password successfully changed.",
        data: null
    });
});

export const AuthControllers = {
    loginUser,
    changePassword
};
