import { Router } from "express";
import { UserControllers } from "./user.controller";
import { StudentValidations } from "../student/student.validation";
import { FacultyValidations } from "../faculty/faculty.validation";
import { AdminValidations } from "../admin/admin.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
    "/create-student",
    auth("admin"),
    validateRequest(
        StudentValidations.StudentCreationValidationSchema
    ),
    UserControllers.createStudent
);

router.post(
    "/create-faculty",
    auth("admin"),
    validateRequest(
        FacultyValidations.FacultyCreationValidationSchema
    ),
    UserControllers.createFaculty
);

router.post(
    "/create-admin",
    auth("admin"),
    validateRequest(AdminValidations.AdminCreationValidationSchema),
    UserControllers.createAdmin
);

router.get(
    "/me",
    auth("admin", "faculty", "student"),
    UserControllers.createAdmin
);

export const UserRoutes = router;
