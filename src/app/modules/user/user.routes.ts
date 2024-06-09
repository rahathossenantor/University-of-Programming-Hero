import { Router } from "express";
import { UserControllers } from "./user.controller";
import { StudentValidations } from "../student/student.validation";
import { FacultyValidations } from "../faculty/faculty.validation";
import { AdminValidations } from "../admin/admin.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.post(
    "/create-student",
    validateRequest(
        StudentValidations.StudentCreationValidationSchema
    ),
    UserControllers.createStudent
);

router.post(
    "/create-faculty",
    validateRequest(
        FacultyValidations.FacultyCreationValidationSchema
    ),
    UserControllers.createFaculty
);

router.post(
  "/create-admin",
  validateRequest(AdminValidations.AdminCreationValidationSchema),
  UserControllers.createAdmin
);

export const UserRoutes = router;
