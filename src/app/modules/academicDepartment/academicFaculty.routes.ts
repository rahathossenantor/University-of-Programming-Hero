import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicDepartmentValidations } from "./academicDepartment.validatin";
import { AcademicDepartmentControllers } from "./academicDepartment.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
    "/create-academic-department",
    auth("super-admin", "admin"),
    validateRequest(
        AcademicDepartmentValidations.AcademicDepartmentCreationValidationSchema
    ),
    AcademicDepartmentControllers.createAcademicDepartment
);
router.patch(
    "/:id",
    auth("super-admin", "admin"),
    validateRequest(
        AcademicDepartmentValidations.AcademicDepartmentUpdatationValidationSchema
    ),
    AcademicDepartmentControllers.updateAcademicDepartment
);
router.get("/", AcademicDepartmentControllers.getAllAcademicDepartments);
router.get("/:id", AcademicDepartmentControllers.getSingleAcademicDepartment);

export const AcademicDepartmentRoutes = router;
