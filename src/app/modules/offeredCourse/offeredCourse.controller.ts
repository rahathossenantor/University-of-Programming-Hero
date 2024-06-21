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

// update offered course
const updateOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await OfferedCourseServices.updateOfferedCourseIntoDB(id, req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Offered course is updated succesfully.",
        data: dbRes
    });
});

export const OfferedCourseControllers = {
    createOfferedCourse,
    updateOfferedCourse
};
