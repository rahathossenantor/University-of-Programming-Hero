import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import { SemesterRegistrationControllers } from "./semesterRegistration.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
    "/create-semester-registration",
    auth("super-admin", "admin", "faculty"),
    validateRequest(
        SemesterRegistrationValidations.SemesterRegistrationCreationValidationSchema
    ),
    SemesterRegistrationControllers.createSemesterRegistration
);

router.get("/", SemesterRegistrationControllers.getAllSemesterRegistrations);
router.get("/:id", SemesterRegistrationControllers.getSingleSemesterRegistration);

router.patch(
    "/:id",
    auth("super-admin", "admin", "faculty"),
    validateRequest(SemesterRegistrationValidations.SemesterRegistrationUpdatationValidationSchema),
    SemesterRegistrationControllers.updateSemesterRegistration
);

router.delete(
    "/:id",
    auth("super-admin", "admin", "faculty"),
    SemesterRegistrationControllers.deleteSemesterRegistration
);

export const SemesterRegistrationRoutes = router;
