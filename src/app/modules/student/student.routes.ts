import { Router } from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidations } from "./student.validation";

const router = Router();

router.get("/", StudentControllers.getAllStudents);
router.get("/:studentId", StudentControllers.getSingleStudent);
router.patch(
    "/:studentId",
    validateRequest(StudentValidations.StudentUpdatationValidationSchema),
    StudentControllers.updateStudent
);
router.delete("/:studentId", StudentControllers.deleteStudent);

export const StudentRoutes = router;
