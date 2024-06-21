import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { OfferedCourseServices } from "./offeredCourse.service";

// create offered course
const createOfferedCourse = catchAsync(async (req, res) => {
    const dbRes = await OfferedCourseServices.createOfferedCourseIntoDB(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Offered course is created.",
        data: dbRes
    });
});

export const OfferedCourseControllers = {
    createOfferedCourse
};
