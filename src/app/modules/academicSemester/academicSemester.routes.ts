import { Router } from "express";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicSemesterValidations } from "./academicSemester.validation";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
    "/create-academic-semester",
    auth("super-admin", "admin"),
    validateRequest(
        AcademicSemesterValidations.AcademicSemesterCreationValidationSchema
    ),
    AcademicSemesterControllers.createAcademicSemester
);
router.patch(
    "/:id",
    auth("super-admin", "admin"),
    validateRequest(
        AcademicSemesterValidations.AcademicSemesterUpdatationValidationSchema
    ),
    AcademicSemesterControllers.updateAcademicSemester
);
router.get("/", AcademicSemesterControllers.getAllAcademicSemesters);
router.get("/:id", AcademicSemesterControllers.getSingleAcademicSemester);

export const AcademicSemesterRoutes = router;
