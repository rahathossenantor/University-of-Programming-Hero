import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Course } from "./course.model";
import { TCourse } from "./course.interface";
import QueryBuilder from "../../builder/QueryBuilder";

// create a new course
const createCourseIntoDB = async (payload: TCourse) => {
    const dbRes = await Course.create(payload);
    return dbRes;
};

// get all courses
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseSearchableFields: string[] = ["title", "prefix", "code"];
    const courseQuery = new QueryBuilder(Course.find().populate("preRequisiteCourses.course"), query)
        .search(courseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .limitFields();

    const dbRes = await courseQuery.modelQuery;
    return dbRes;
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
    if (preRequisiteCourses && preRequisiteCourses.length) {
        // remove pre requisite courses
        const preRequisiteCoursesIds = preRequisiteCourses
            .filter(preRequisite => preRequisite.course && preRequisite.isDeleted)
            .map(preRequisite => preRequisite.course);
        if (preRequisiteCoursesIds.length) {
            await Course.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        preRequisiteCourses: { course: { $in: preRequisiteCoursesIds } }
                    }
                }
            );
        }

        // add pre requisite courses
        const newPreRequisiteCourses = preRequisiteCourses
            .filter(preRequisite => preRequisite.course && !preRequisite.isDeleted);
        if (newPreRequisiteCourses.length) {
            await Course.findByIdAndUpdate(
                id,
                {
                    $addToSet: {
                        preRequisiteCourses: { $each: newPreRequisiteCourses }
                    }
                }
            );
        }
    }

    const updatedBasicCourse = await Course.findByIdAndUpdate(
        id,
        remainingCourseData,
        {
            new: true,
            runValidators: true
        }
    ).populate("preRequisiteCourses.course");
    return updatedBasicCourse;
};

// delete course
const deleteCourseFromDB = async (id: string) => {
    const dbRes = await Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return dbRes;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB
};
