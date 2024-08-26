import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { CourseServices } from "./course.service";

// create course
const createCourse = catchAsync(async (req, res) => {
    const dbRes = await CourseServices.createCourseIntoDB(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Course is created succesfully.",
        data: dbRes
    });
});

// get all courses
const getAllCourses = catchAsync(async (req, res) => {
    const dbRes = await CourseServices.getAllCoursesFromDB(req.query);

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

// update course
const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await CourseServices.updateCourseIntoDB(id, req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Course is updated succesfully.",
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

// assign faculties in course
const assignFacultiesWithCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { faculties } = req.body;
    const dbRes = await CourseServices.assignFacultiesWithCourseIntoDB(id, faculties);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Faculties assigned successfully.",
        data: dbRes
    });
});

// get faculties with course
const getFacultiesWithCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await CourseServices.getFacultiesWithCourseFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Faculties are retrived successfully.",
        data: dbRes
    });
});

// remove faculties from course
const removeFacultiesFromCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { faculties } = req.body;
    const dbRes = await CourseServices.removeFacultiesFromCourseFromDB(id, faculties);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Faculties removed successfully.",
        data: dbRes
    });
});

export const CourseControllers = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    updateCourse,
    deleteCourse,
    assignFacultiesWithCourse,
    removeFacultiesFromCourse,
    getFacultiesWithCourse
};
