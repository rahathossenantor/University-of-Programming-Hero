import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { EnrolledCourseServices } from "./enrolledCourse.service";

// create enrolled course
const createEnrolledCourse = catchAsync(async (req, res) => {
    const dbRes = await EnrolledCourseServices.createEnrolledCourseIntoDB(req.user.id, req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Enrolled course is created successfully.",
        data: dbRes
    });
});

export const EnrolledCourseControllers = {
    createEnrolledCourse
};
