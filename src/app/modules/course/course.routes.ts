import { Router } from "express";
import { CourseControllers } from "./course.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
    "/create-course",
    auth("super-admin", "admin"),
    validateRequest(
        CourseValidations.CourseCreationValidationSchema
    ),
    CourseControllers.createCourse
);
router.get("/", CourseControllers.getAllCourses);
router.get("/:id", CourseControllers.getSingleCourse);

router.patch(
    "/:id",
    auth("super-admin", "admin"),
    validateRequest(CourseValidations.CourseUpdatationValidationSchema),
    CourseControllers.updateCourse
);
router.delete("/:id",
    auth("super-admin", "admin"),
    CourseControllers.deleteCourse
);
router.put(
    "/:id/assign-faculties",
    auth("super-admin", "admin"),
    validateRequest(CourseValidations.FacultiesWithCourseValidationSchema),
    CourseControllers.assignFacultiesWithCourse
);
router.get(
    "/:id/get-faculties",
    CourseControllers.getFacultiesWithCourse
);
router.delete(
    "/:id/remove-faculties",
    auth("super-admin", "admin"),
    validateRequest(CourseValidations.FacultiesWithCourseValidationSchema),
    CourseControllers.removeFacultiesFromCourse
);

export const CourseRoutes = router;
