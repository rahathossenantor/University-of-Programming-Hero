import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { EnrolledCourseControllers } from "./enrolledCourse.controller";
import { EnrolledCourseValidations } from "./enrolledCourse.validation";

const router = Router();

router.post(
    "/create-enrolled-course",
    auth("student"),
    validateRequest(
        EnrolledCourseValidations.EnrolledCourseCreationValidationSchema
    ),
    EnrolledCourseControllers.createEnrolledCourse
);

export const EnrolledCourseRoutes = router;
