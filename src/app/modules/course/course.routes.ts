import { Router } from "express";
import { CourseControllers } from "./course.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";

const router = Router();

router.post(
    "/create-course",
    validateRequest(
        CourseValidations.CourseCreationValidationSchema
    ),
    CourseControllers.createCourse
);
router.get("/", CourseControllers.getAllCourses);
router.get("/:id", CourseControllers.getSingleCourse);
router.delete("/:id", CourseControllers.deleteCourse);

export const CourseRoutes = router;
