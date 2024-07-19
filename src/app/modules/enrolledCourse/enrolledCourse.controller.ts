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

// update enrolled course marks
const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
    const dbRes = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(req.user.id, req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Enrolled course marks updated successfully.",
        data: dbRes
    });
});

// get my enrolled courses
const getMyEnrolledCourses = catchAsync(async (req, res) => {
    const dbRes = await EnrolledCourseServices.getMyEnrolledCoursesFromDB(req.user.id, req.query);

    res.status(httpStatus.OK).json({
        success: true,
        message: "My enrolled courses retrived successfully.",
        data: dbRes
    });
});

export const EnrolledCourseControllers = {
    createEnrolledCourse,
    updateEnrolledCourseMarks,
    getMyEnrolledCourses
};
