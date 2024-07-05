import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post(
    "/login",
    validateRequest(AuthValidations.LoginValidationSchema),
    AuthControllers.loginUser
);
router.post(
    "/change-password",
    validateRequest(AuthValidations.PasswordChangeValidationSchema),
    AuthControllers.changePassword
);

export const AuthRoutes = router;
