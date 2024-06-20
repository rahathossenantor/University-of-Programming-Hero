import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import { SemesterRegistrationControllers } from "./semesterRegistration.controller";

const router = Router();

router.post(
    "/create-semester-registration",
    validateRequest(
        SemesterRegistrationValidations.SemesterRegistrationCreationValidationSchema
    ),
    SemesterRegistrationControllers.createSemesterRegistration
);

export const SemesterRegistrationRoutes = router;
