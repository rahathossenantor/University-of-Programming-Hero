import { Router } from "express";
import { FacultyControllers } from "./faculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyValidations } from "./faculty.validation";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/",
    auth("super-admin", "admin"),
    FacultyControllers.getAllFaculties
);
router.get("/:id", FacultyControllers.getSingleFaculty);
router.patch(
    "/:id",
    auth("super-admin", "admin"),
    validateRequest(FacultyValidations.FacultyUpdatationValidationSchema),
    FacultyControllers.updateFaculty
);
router.delete("/:id",
    auth("super-admin", "admin"),
    FacultyControllers.deleteFaculty
);

export const FacultyRoutes = router;
