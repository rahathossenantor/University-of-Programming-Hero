import { Router } from "express";
import { AdminControllers } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidations } from "./admin.validation";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/", auth("admin"), AdminControllers.getAllAdmins);
router.get("/:id", auth("admin"), AdminControllers.getSingleAdmin);
router.patch(
    "/:id",
    auth("admin"),
    validateRequest(AdminValidations.AdminUpdatationValidationSchema),
    AdminControllers.updateAdmin
);
router.delete("/:id", auth("admin"), AdminControllers.deleteAdmin);

export const AdminRoutes = router;
