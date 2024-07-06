import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import config from "../../config";

// login user
const loginUser = catchAsync(async (req, res) => {
    const dbRes = await AuthServices.loginUser(req.body);
    const { refreshToken } = dbRes;
    res.cookie("refreshToken", refreshToken, { secure: config.node_env === "production", httpOnly: true })

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

// get access token by refresh token
const getAccessTokenByRefreshToken = catchAsync(async (req, res) => {
    const dbRes = await AuthServices.getAccessTokenByRefreshToken(req.cookies.refreshToken);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Token generated succesfully.",
        data: dbRes
    });
});

// forget password
const forgetPassword = catchAsync(async (req, res) => {
    const resetUrl = await AuthServices.forgetPassword(req.body.id);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Reset password link generated successfully.",
        data: resetUrl
    });
});

export const AuthControllers = {
    loginUser,
    changePassword,
    forgetPassword,
    getAccessTokenByRefreshToken
};
