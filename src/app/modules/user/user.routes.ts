import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { StudentValidations } from "../student/student.validation";
import { FacultyValidations } from "../faculty/faculty.validation";
import { AdminValidations } from "../admin/admin.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserValidations } from "./user.validation";
import { upload } from "../../utils/uploadImage";

const router = Router();

router.post(
    "/create-student",
    auth("admin"),
    upload.single("avatar"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
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
    UserControllers.getMe
);

router.patch(
    "/update-status/:id",
    auth("admin"),
    validateRequest(UserValidations.UpdateUserStatusValidationSchema),
    UserControllers.updateUserStatus
);

export const UserRoutes = router;
