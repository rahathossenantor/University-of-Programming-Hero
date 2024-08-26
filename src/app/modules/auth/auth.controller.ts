import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import config from "../../config";
import AppError from "../../errors/AppError";

// login user
const loginUser = catchAsync(async (req, res) => {
    const dbRes = await AuthServices.loginUser(req.body);
    const { accessToken, refreshToken, needsPasswordChange } = dbRes;
    res.cookie("refreshToken", refreshToken, {
        secure: config.node_env === "production",
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 365
    });

    res.status(httpStatus.OK).json({
        success: true,
        message: "Login succesfull.",
        data: {
            accessToken,
            needsPasswordChange
        }
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
    // await AuthServices.forgetPassword(req.body.id);
    const dbRes = await AuthServices.forgetPassword(req.body.id);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Reset password link sent successfully.",
        data: dbRes
    });
});

// reset password
const resetPassword = catchAsync(async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        throw new AppError(httpStatus.NOT_FOUND, "Token does not found!");
    }
    await AuthServices.resetPassword(req.body, token);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Password reset successfull.",
        data: null
    });
});

export const AuthControllers = {
    loginUser,
    getAccessTokenByRefreshToken,
    changePassword,
    forgetPassword,
    resetPassword
};
