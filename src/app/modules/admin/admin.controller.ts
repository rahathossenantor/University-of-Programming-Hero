import { AdminServices } from "./admin.services";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

// get all admins
const getAllAdmins = catchAsync(async (req, res) => {
    const dbRes = await AdminServices.getAllAdminsFromDB(req.query);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes.length ? "Admins are retrived successfully." : "No admin found!"),
        data: dbRes
    });
});

export const AdminControllers = {
    getAllAdmins
};
