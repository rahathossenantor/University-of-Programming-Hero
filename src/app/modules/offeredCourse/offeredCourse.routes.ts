import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseValidations } from "./offeredCourse.validation";
import { OfferedCourseControllers } from "./offeredCourse.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
    "/create-offered-course",
    auth("super-admin", "admin", "faculty"),
    validateRequest(
        OfferedCourseValidations.OfferedCourseCreationValidationSchema
    ),
    OfferedCourseControllers.createOfferedCourse
);
router.get("/", OfferedCourseControllers.getAllOfferedCourses);
router.get(
    "/get-my-offered-courses",
    auth("student"),
    OfferedCourseControllers.getMyOfferedCourse
);
router.get("/:id", OfferedCourseControllers.getSingleOfferedCourse);
router.patch(
    "/:id",
    auth("super-admin", "admin", "faculty"),
    validateRequest(OfferedCourseValidations.OfferedCourseUpdatationValidationSchema),
    OfferedCourseControllers.updateOfferedCourse
);
router.delete(
    "/:id",
    auth("super-admin", "admin", "faculty"),
    OfferedCourseControllers.deleteOfferedCourse
);

export const OfferedCourseRoutes = router;
