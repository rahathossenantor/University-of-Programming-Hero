import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { CourseServices } from "./course.service";

// get all courses
const getAllCourses = catchAsync(async (req, res) => {
    const dbRes = await CourseServices.getAllCoursesFromDB();

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes.length ? "Courses are retrived successfully." : "No course found!"),
        data: dbRes
    });
});

export const CourseControllers = {
    getAllCourses
};
