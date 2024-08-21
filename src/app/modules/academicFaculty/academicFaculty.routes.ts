import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyValidations } from "./academicFaculty.validation";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
    "/create-academic-faculty",
    auth("super-admin", "admin"),
    validateRequest(
        AcademicFacultyValidations.AcademicFacultyValidationSchema
    ),
    AcademicFacultyControllers.createAcademicFaculty
);
router.patch(
    "/:id",
    auth("super-admin", "admin"),
    validateRequest(
        AcademicFacultyValidations.AcademicFacultyValidationSchema
    ),
    AcademicFacultyControllers.updateAcademicFaculty
);
router.get("/",
    auth("super-admin", "admin", "faculty"),
    AcademicFacultyControllers.getAllAcademicFaculties
);
router.get("/:id", AcademicFacultyControllers.getSingleAcademicFaculty);

export const AcademicFacultyRoutes = router;
