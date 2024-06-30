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
router.get("/", SemesterRegistrationControllers.getAllSemesterRegistrations);
router.get("/:id", SemesterRegistrationControllers.getSingleSemesterRegistration);
router.patch(
    "/:id",
    validateRequest(SemesterRegistrationValidations.SemesterRegistrationUpdatationValidationSchema),
    SemesterRegistrationControllers.updateSemesterRegistration
);
router.delete(
    "/:id",
    SemesterRegistrationControllers.deleteSemesterRegistration
);

export const SemesterRegistrationRoutes = router;
