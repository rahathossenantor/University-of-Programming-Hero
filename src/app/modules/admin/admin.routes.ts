import { Router } from "express";
import { AdminControllers } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidations } from "./admin.validation";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/",
    auth("super-admin", "admin"),
    AdminControllers.getAllAdmins
);
router.get("/:id",
    auth("super-admin", "admin"),
    AdminControllers.getSingleAdmin
);
router.patch(
    "/:id",
    auth("super-admin", "admin"),
    validateRequest(AdminValidations.AdminUpdatationValidationSchema),
    AdminControllers.updateAdmin
);
router.delete("/:id",
    auth("super-admin", "admin"),
    AdminControllers.deleteAdmin
);

export const AdminRoutes = router;
