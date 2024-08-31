import { Router } from "express";
// import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { StudentValidations } from "../student/student.validation";
import { FacultyValidations } from "../faculty/faculty.validation";
import { AdminValidations } from "../admin/admin.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserValidations } from "./user.validation";
// import { upload } from "../../utils/uploadImage";

const router = Router();

// with image upload utility
// router.post(
//     "/create-admin",
//     auth("super-admin", "admin"),
//     upload.single("file"),
//     (req: Request, res: Response, next: NextFunction) => {
//         req.body = JSON.parse(req.body.data);
//         next();
//     },
//     validateRequest(AdminValidations.AdminCreationValidationSchema),
//     UserControllers.createAdmin
// );

// router.post(
//     "/create-faculty",
//     auth("super-admin", "admin"),
//     upload.single("file"),
//     (req: Request, res: Response, next: NextFunction) => {
//         req.body = JSON.parse(req.body.data);
//         next();
//     },
//     validateRequest(
//         FacultyValidations.FacultyCreationValidationSchema
//     ),
//     UserControllers.createFaculty
// );

// router.post(
//     "/create-student",
//     auth("super-admin", "admin"),
//     upload.single("file"),
//     (req: Request, res: Response, next: NextFunction) => {
//         req.body = JSON.parse(req.body.data);
//         next();
//     },
//     validateRequest(
//         StudentValidations.StudentCreationValidationSchema
//     ),
//     UserControllers.createStudent
// );

// without image upload utility
router.post(
    "/create-student",
    auth("super-admin", "admin"),
    validateRequest(
        StudentValidations.StudentCreationValidationSchema
    ),
    UserControllers.createStudent
);

router.post(
    "/create-faculty",
    auth("super-admin", "admin"),
    validateRequest(
        FacultyValidations.FacultyCreationValidationSchema
    ),
    UserControllers.createFaculty
);

router.post(
    "/create-admin",
    auth("super-admin", "admin"),
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
    auth("super-admin", "admin"),
    validateRequest(UserValidations.UpdateUserStatusValidationSchema),
    UserControllers.updateUserStatus
);

export const UserRoutes = router;
