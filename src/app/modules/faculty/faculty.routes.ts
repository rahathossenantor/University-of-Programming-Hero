import { Router } from "express";
import { FacultyControllers } from "./faculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyValidations } from "./faculty.validation";

const router = Router();

router.get("/", FacultyControllers.getAllFaculties);
router.get("/:facultyId", FacultyControllers.getSingleFaculty);
router.patch(
    "/:facultyId",
    validateRequest(FacultyValidations.FacultyUpdatationValidationSchema),
    FacultyControllers.updateFaculty
);
router.delete("/:facultyId", FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
