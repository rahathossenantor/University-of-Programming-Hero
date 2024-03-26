import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.services";

const createAcademicSemester = catchAsync(async (req, res) => {
    const dbRes = await AcademicSemesterServices.createAcademicSemesterIntoDB(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Academic semester created.",
        data: dbRes
    });
});

export const AcademicSemesterControllers = {
    createAcademicSemester
};
