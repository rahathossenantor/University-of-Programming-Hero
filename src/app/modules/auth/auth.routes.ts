import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { userRoles } from "../user/user.constant";
import { TUserRoles } from "../user/user.interface";

const router = Router();

router.post(
    "/login",
    validateRequest(AuthValidations.LoginValidationSchema),
    AuthControllers.loginUser
);
router.post(
    "/change-password",
    auth(userRoles.admin as TUserRoles, userRoles.faculty as TUserRoles, userRoles.student as TUserRoles),
    validateRequest(AuthValidations.PasswordChangeValidationSchema),
    AuthControllers.changePassword
);
router.post(
    "/refresh-token",
    validateRequest(AuthValidations.RefreshTokenValidationSchema),
    AuthControllers.getAccessTokenByRefreshToken
);
router.post(
    "/forget-password",
    validateRequest(AuthValidations.ForgetPasswordValidationSchema),
    AuthControllers.forgetPassword
);
router.post(
    "/reset-password",
    validateRequest(AuthValidations.ResetPasswordValidationSchema),
    AuthControllers.resetPassword
);

export const AuthRoutes = router;
