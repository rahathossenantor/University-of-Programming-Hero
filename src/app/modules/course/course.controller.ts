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

// get single course
const getSingleCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await CourseServices.getSingleCourseFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes ? "Course is retrived successfully." : "No course found!"),
        data: dbRes
    });
});

// delete single course
const deleteCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await CourseServices.deleteCourseFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Course is deleted successfully.",
        data: dbRes
    });
});

export const CourseControllers = {
    getAllCourses,
    getSingleCourse,
    deleteCourse
};
