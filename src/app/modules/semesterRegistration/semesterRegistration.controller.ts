import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { SemesterRegistrationServices } from "./semesterRegistration.service";

// create semester registration
const createSemesterRegistration = catchAsync(async (req, res) => {
    const dbRes = await SemesterRegistrationServices.createSemesterRegistrationIntoDB(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Semester registration is created.",
        data: dbRes
    });
});

export const SemesterRegistrationControllers = {
    createSemesterRegistration
};
