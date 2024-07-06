import { Router } from "express";
import { CourseControllers } from "./course.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import auth from "../../middlewares/auth";
import { userRoles } from "../user/user.constant";
import { TUserRoles } from "../user/user.interface";

const router = Router();

router.post(
    "/create-course",
    validateRequest(
        CourseValidations.CourseCreationValidationSchema
    ),
    CourseControllers.createCourse
);
router.get("/", auth(userRoles.admin as TUserRoles, userRoles.faculty as TUserRoles, userRoles.student as TUserRoles), CourseControllers.getAllCourses);

router.get("/:id", CourseControllers.getSingleCourse);
router.patch(
    "/:id",
    validateRequest(CourseValidations.CourseUpdatationValidationSchema),
    CourseControllers.updateCourse
);
router.delete("/:id", CourseControllers.deleteCourse);
router.put(
    "/:id/assign-faculties",
    validateRequest(CourseValidations.FacultiesWithCourseValidationSchema),
    CourseControllers.assignFacultiesWithCourse
);
router.delete(
    "/:id/remove-faculties",
    validateRequest(CourseValidations.FacultiesWithCourseValidationSchema),
    CourseControllers.removeFacultiesFromCourse
);

export const CourseRoutes = router;
