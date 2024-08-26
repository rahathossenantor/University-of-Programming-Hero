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

// get all offered courses
const getAllOfferedCourses = catchAsync(async (req, res) => {
    const dbRes = await OfferedCourseServices.getAllOfferedCoursesFromDB(req.query);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes.data.length ? "Offered courses are retrived successfully." : "No offered course found!"),
        data: dbRes
    });
});

// get single offered course
const getSingleOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: (dbRes ? "Offered course is retrived successfully." : "No offered course found!"),
        data: dbRes
    });
});

// get my offered course
const getMyOfferedCourse = catchAsync(async (req, res) => {
    const dbRes = await OfferedCourseServices.getMyOfferedCourseFromDB(req.user.id, req.query);

    res.status(httpStatus.OK).json({
        success: true,
        message: "My offered courses is retrived successfully.",
        meta: dbRes.meta,
        data: dbRes.data
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

// delete offered course
const deleteOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dbRes = await OfferedCourseServices.deleteOfferedCourseFromDB(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Offered course is deleted successfully.",
        data: dbRes
    });
});

export const OfferedCourseControllers = {
    createOfferedCourse,
    getAllOfferedCourses,
    getSingleOfferedCourse,
    getMyOfferedCourse,
    updateOfferedCourse,
    deleteOfferedCourse
};
