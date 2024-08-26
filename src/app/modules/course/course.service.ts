import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Course, CourseFaculty } from "./course.model";
import { TCourse, TCourseFaculty } from "./course.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import mongoose from "mongoose";
import { courseSearchableFields } from "./course.constant";

// create a new course
const createCourseIntoDB = async (payload: TCourse) => {
    const dbRes = await Course.create(payload);
    return dbRes;
};

// get all courses
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const coursesQuery = new QueryBuilder(Course.find().populate("preRequisiteCourses.course"), query)
        .search(courseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .limitFields();

    const dbRes = await coursesQuery.modelQuery;
    const meta = await coursesQuery.countTotal();

    return {
        data: dbRes,
        meta
    };
};

// get single course
const getSingleCourseFromDB = async (id: string) => {
    const dbRes = await Course.findById(id).populate("preRequisiteCourses.course");

    if (!dbRes) {
        throw new AppError(httpStatus.NOT_FOUND, "Course does not exist!");
    }
    return dbRes;
};

// update course
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...remainingCourseData } = payload;

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        if (preRequisiteCourses && preRequisiteCourses.length) {
            // remove pre requisite courses
            const preRequisiteCoursesIds = preRequisiteCourses
                .filter(preRequisite => preRequisite.course && preRequisite.isDeleted)
                .map(preRequisite => preRequisite.course);
            if (preRequisiteCoursesIds.length) {
                const dbRes = await Course.findByIdAndUpdate(
                    id,
                    {
                        $pull: {
                            preRequisiteCourses: { course: { $in: preRequisiteCoursesIds } }
                        }
                    },
                    {
                        new: true,
                        runValidators: true,
                        session
                    }
                );
                if (!dbRes) {
                    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course!");
                }
            }

            // add pre requisite courses
            const newPreRequisiteCourses = preRequisiteCourses
                .filter(preRequisite => preRequisite.course && !preRequisite.isDeleted);
            if (newPreRequisiteCourses.length) {
                const dbRes = await Course.findByIdAndUpdate(
                    id,
                    {
                        $addToSet: {
                            preRequisiteCourses: { $each: newPreRequisiteCourses }
                        }
                    },
                    {
                        new: true,
                        runValidators: true,
                        session
                    }
                );
                if (!dbRes) {
                    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course!");
                }
            }
        }

        const updatedBasicCourse = await Course.findByIdAndUpdate(
            id,
            remainingCourseData,
            {
                new: true,
                runValidators: true,
                session
            }
        ).populate("preRequisiteCourses.course");
        if (!updatedBasicCourse) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course!");
        }

        await session.commitTransaction();
        await session.endSession();
        return updatedBasicCourse;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course!");
    }
};

// delete course
const deleteCourseFromDB = async (id: string) => {
    const dbRes = await Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return dbRes;
};

// assign faculties in course
const assignFacultiesWithCourseIntoDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const dbRes = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            course: id,
            $addToSet: { faculties: { $each: payload } }
        },
        {
            upsert: true,
            new: true,
            runValidators: true
        }
    );
    return dbRes;
};

// get faculties with course
const getFacultiesWithCourseFromDB = async (id: string) => {
    const dbRes = await CourseFaculty.findOne({ course: id }).populate("faculties");

    if (!dbRes) {
        throw new AppError(httpStatus.NOT_FOUND, "Course does not exist!");
    }
    return dbRes;
};

// remove faculties from course
const removeFacultiesFromCourseFromDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const dbRes = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            $pull: { faculties: { $in: payload } }
        },
        {
            new: true,
            runValidators: true
        }
    );
    return dbRes;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB,
    assignFacultiesWithCourseIntoDB,
    removeFacultiesFromCourseFromDB,
    getFacultiesWithCourseFromDB
};
