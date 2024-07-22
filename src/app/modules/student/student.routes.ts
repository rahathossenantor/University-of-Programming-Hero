import { Router } from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidations } from "./student.validation";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/",
    auth("super-admin", "admin", "faculty"),
    StudentControllers.getAllStudents
);

router.get("/:id",
    auth("super-admin", "admin", "faculty"),
    StudentControllers.getSingleStudent
);

router.patch(
    "/:id",
    auth("super-admin", "admin", "faculty"),
    validateRequest(StudentValidations.StudentUpdatationValidationSchema),
    StudentControllers.updateStudent
);
router.delete("/:id",
    auth("super-admin", "admin", "faculty"),
    StudentControllers.deleteStudent
);

export const StudentRoutes = router;
