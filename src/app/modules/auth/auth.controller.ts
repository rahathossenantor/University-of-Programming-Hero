import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
    const dbRes = await AuthServices.loginUser(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Login succesfull.",
        data: dbRes
    });
});

export const AuthControllers = {
    loginUser
};
