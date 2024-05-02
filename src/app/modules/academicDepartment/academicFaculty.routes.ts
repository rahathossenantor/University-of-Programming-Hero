import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicDepartmentValidations } from "./academicDepartment.validatin";
import { AcademicDepartmentControllers } from "./academicDepartment.controller";

const router = Router();

router.post(
    "/create-academic-department",
    validateRequest(
        AcademicDepartmentValidations.AcademicDepartmentCreationValidationSchema
    ),
    AcademicDepartmentControllers.createAcademicDepartment
);
router.patch(
    "/:academicDepartmentId",
    validateRequest(
        AcademicDepartmentValidations.AcademicDepartmentUpdatationValidationSchema
    ),
    AcademicDepartmentControllers.updateAcademicDepartment
);
router.get("/", AcademicDepartmentControllers.getAllAcademicDepartments);
router.get("/:academicDepartmentId", AcademicDepartmentControllers.getSingleAcademicDepartment);

export const AcademicDepartmentRoutes = router;
