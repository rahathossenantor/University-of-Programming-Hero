import { Router } from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidations } from "./student.validation";

const router = Router();

router.get("/", StudentControllers.getAllStudents);
router.get("/:id", StudentControllers.getSingleStudent);
router.patch(
    "/:id",
    validateRequest(StudentValidations.StudentUpdatationValidationSchema),
    StudentControllers.updateStudent
);
router.delete("/:id", StudentControllers.deleteStudent);

export const StudentRoutes = router;
