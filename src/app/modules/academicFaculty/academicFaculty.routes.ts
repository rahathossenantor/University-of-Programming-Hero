import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyValidations } from "./academicFaculty.validation";
import { AcademicFacultyControllers } from "./academicFaculty.controller";

const router = Router();

router.post(
    "/create-academic-faculty",
    validateRequest(
        AcademicFacultyValidations.AcademicFacultyValidationSchema
    ),
    AcademicFacultyControllers.createAcademicFaculty
);
router.patch(
    "/:academicFacultyId",
    validateRequest(
        AcademicFacultyValidations.AcademicFacultyValidationSchema
    ),
    AcademicFacultyControllers.updateAcademicFaculty
);
router.get("/", AcademicFacultyControllers.getAllAcademicFaculties);
router.get("/:academicFacultyId", AcademicFacultyControllers.getSingleAcademicFaculty);

export const AcademicFacultyRoutes = router;
