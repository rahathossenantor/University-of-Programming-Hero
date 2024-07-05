import { Router } from "express";
import { FacultyControllers } from "./faculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyValidations } from "./faculty.validation";
import auth from "../../middlewares/auth";
import { userRoles } from "../user/user.constant";
import { TUserRoles } from "../user/user.interface";

const router = Router();

router.get("/", auth(userRoles.admin as TUserRoles), FacultyControllers.getAllFaculties);
router.get("/:id", FacultyControllers.getSingleFaculty);
router.patch(
    "/:id",
    validateRequest(FacultyValidations.FacultyUpdatationValidationSchema),
    FacultyControllers.updateFaculty
);
router.delete("/:id", FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
