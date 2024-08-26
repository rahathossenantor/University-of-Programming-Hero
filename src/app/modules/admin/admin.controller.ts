import { AdminServices } from "./admin.service";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

// get all admins
const getAllAdmins = catchAsync(async (req, res) => {
    const dbRes = await AdminServices.getAllAdminsFromDB(req.query);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes.data.length ? "Admins are retrived successfully." : "No admin found!"),
        data: dbRes
    });
});

// get single admin
const getSingleAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await AdminServices.getSingleAdminFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes ? "Admin is retrived successfully." : "No admin found!"),
        data: dbRes
    });
});

// update admin
const updateAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { admin } = req.body;
    const dbRes = await AdminServices.updateAdminIntoDB(id, admin);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Admin is updated succesfully.",
        data: dbRes
    });
});

// delete single admin
const deleteAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await AdminServices.deleteAdminFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Admin is deleted successfully.",
        data: dbRes
    });
});

export const AdminControllers = {
    getAllAdmins,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin
};
