import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseValidations } from "./offeredCourse.validation";
import { OfferedCourseControllers } from "./offeredCourse.controller";

const router = Router();

router.post(
    "/create-offered-course",
    validateRequest(
        OfferedCourseValidations.OfferedCourseCreationValidationSchema
    ),
    OfferedCourseControllers.createOfferedCourse
);
router.get("/", OfferedCourseControllers.getAllOfferedCourses);
router.get("/:id", OfferedCourseControllers.getSingleOfferedCourse);
router.patch(
    "/:id",
    validateRequest(OfferedCourseValidations.OfferedCourseUpdatationValidationSchema),
    OfferedCourseControllers.updateOfferedCourse
);
router.delete(
    "/:id",
    OfferedCourseControllers.deleteOfferedCourse
);

export const OfferedCourseRoutes = router;
