import { FacultyServices } from "./faculty.services";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

// get all faculties
const getAllFaculties = catchAsync(async (req, res) => {
    const dbRes = await FacultyServices.getAllFacultiesFromDB(req.query);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes.length ? "Faculties are retrived successfully." : "No faculty found!"),
        data: dbRes
    });
});

export const FacultyControllers = {
    getAllFaculties
};
