import { Router } from "express";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicSemesterValidations } from "./academicSemester.validation";

const router = Router();

router.post(
    "/create-academic-semester",
    validateRequest(
        AcademicSemesterValidations.AcademicSemesterCreationValidationSchema
    ),
    AcademicSemesterControllers.createAcademicSemester
);
router.patch(
    "/:academicSemesterId",
    validateRequest(
        AcademicSemesterValidations.AcademicSemesterUpdatationValidationSchema
    ),
    AcademicSemesterControllers.updateAcademicSemester
);
router.get("/", AcademicSemesterControllers.getAllAcademicSemesters);
router.get("/:academicSemesterId", AcademicSemesterControllers.getSingleAcademicSemester);

export const AcademicSemesterRoutes = router;
