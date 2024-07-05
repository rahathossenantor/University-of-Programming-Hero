import { Router } from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidations } from "./student.validation";
import auth from "../../middlewares/auth";
import { userRoles } from "../user/user.constant";
import { TUserRoles } from "../user/user.interface";

const router = Router();

router.get("/", auth(userRoles.student as TUserRoles, userRoles.admin as TUserRoles), StudentControllers.getAllStudents);
router.get("/:id", StudentControllers.getSingleStudent);
router.patch(
    "/:id",
    validateRequest(StudentValidations.StudentUpdatationValidationSchema),
    StudentControllers.updateStudent
);
router.delete("/:id", StudentControllers.deleteStudent);

export const StudentRoutes = router;
