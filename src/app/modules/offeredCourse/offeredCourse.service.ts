/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { Course } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { Types } from "mongoose";
import { hasTimeConfliction } from "./offeredCourse.utils";
import QueryBuilder from "../../builder/QueryBuilder";
import { Student } from "../student/student.model";

// create offered course
const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const {
        semesterRegistration,
        academicDepartment,
        academicFaculty,
        course,
        faculty,
        section,
        days,
        startTime,
        endTime
    } = payload;

    const checkField = async (fieldModel: any, id: Types.ObjectId, fieldName: string) => {
        const field = await fieldModel.findById(id);
        if (!field) {
            throw new AppError(httpStatus.NOT_FOUND, `${fieldName} does not exist!`);
        }
        return field;
    };

    const semesterReg = await checkField(SemesterRegistration, semesterRegistration, "Semester registration");
    const academicSemester = semesterReg.academicSemester;
    const acadmcDepartment = await checkField(AcademicDepartment, academicDepartment, "Academic department");
    const acadmcFaculty = await checkField(AcademicFaculty, academicFaculty, "Academic faculty");
    await checkField(Course, course, "Course");
    await checkField(Faculty, faculty, "Faculty");

    // is the faculty belongs to the department
    const isTheFacultyBelongsToTheDepartment = await AcademicDepartment.findOne({
        _id: academicDepartment,
        academicFaculty
    });
    if (!isTheFacultyBelongsToTheDepartment) {
        throw new AppError(httpStatus.BAD_REQUEST, `${acadmcFaculty?.name} is not belongs to The ${acadmcDepartment?.name}!`);
    }

    // is the course already exist with same section
    const isTheCourseAlreadyExistWithSameSection = await OfferedCourse.findOne({
        semesterRegistration,
        course,
        section
    });
    if (isTheCourseAlreadyExistWithSameSection) {
        throw new AppError(httpStatus.BAD_REQUEST, "This course is already exist in this section with the same registered semester!");
    }

    // get the schedules of the faculties
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days }
    }, {
        days: 1,
        startTime: 1,
        endTime: 1
    });
    const newSchedule = {
        days,
        startTime,
        endTime
    };

    if (hasTimeConfliction(assignedSchedules, newSchedule)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `This faculty is not available at that time! Choose other time or day.`
        );
    }

    const dbRes = await OfferedCourse.create({ ...payload, academicSemester });
    return dbRes;
};

// get all offered courses
const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
    const offeredCoursesQuery = new QueryBuilder(OfferedCourse.find(), query)
        .filter()
        .sort()
        .paginate();

    const dbRes = await offeredCoursesQuery.modelQuery;
    const meta = await offeredCoursesQuery.countTotal();
    
    return {
        data: dbRes,
        meta
    };
};

// get my offered course
const getMyOfferedCourseFromDB = async (id: string, query: Record<string, unknown>) => {
    // pagination
    const page: number = Number(query?.page) || 1;
    const limit: number = Number(query?.limit) || 10;
    const skip: number = (page - 1) * limit;

    const student = await Student.findOne({ id });
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, "Student does not exist!");
    }

    const semesterRegistration = await SemesterRegistration.findOne({ status: "ONGOING" });
    if (!semesterRegistration) {
        throw new AppError(httpStatus.NOT_FOUND, "There is no ONGOING semester registration!");
    }

    // queries
    const paginationQuery = [
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ];
    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: semesterRegistration._id,
                academicDepartment: student.academicDepartment,
                academicFaculty: student.academicFaculty
            }
        },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "course"
            }
        },
        {
            $unwind: "course"
        },
        {
            $lookup: {
                from: "enrolledcourses",
                let: {
                    semesterRegistrationId: semesterRegistration._id,
                    studentId: student._id
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$semesterRegistration", "$$semesterRegistrationId"]
                                    },
                                    {
                                        $eq: ["$student", "$$studentId"]
                                    },
                                    {
                                        $eq: ["$isEnrolled", true]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: "enrolledCourses"
            }
        },
        {
            $lookup: {
                from: "enrolledcourses",
                let: {
                    studentId: student._id
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$student", "$$studentId"]
                                    },
                                    {
                                        $eq: ["$isCompleted", true]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: "completedCourses"
            }
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: {
                        input: "$completedCourses",
                        as: "completedCourse",
                        in: "$$completedCourse.course"
                    }
                }
            }
        },
        {
            $addFields: {
                isPreRequisitesFulfilled: {
                    $or: [
                        {
                            $eq: ["$course.preRequisiteCourses", []]
                        },
                        {
                            $setIsSubset: ["$course.preRequisiteCourses.course", "$completedCourseIds"]
                        }
                    ]
                },
                isAlreadyEnrolled: {
                    $in: [
                        "$course._id",
                        {
                            $map: {
                                input: "$enrolledCourses",
                                as: "enrolledCourse",
                                in: "$$enrolledCourse.course"
                            }
                        }
                    ]
                }
            }
        },
        {
            $match: {
                isAlreadyEnrolled: false,
                isPreRequisitesFulfilled: true
            }
        }
    ];

    const dbRes = OfferedCourse.aggregate([...aggregationQuery, ...paginationQuery]);

    const total: number = (await OfferedCourse.aggregate(aggregationQuery)).length;
    const totalPages = Math.ceil(total / limit);

    return {
        data: dbRes,
        meta: {
            page,
            limit,
            totalDocs: total,
            totalPages
        }
    };
};

// get single offered course
const getSingleOfferedCourseFromDB = async (id: string) => {
    const dbRes = await OfferedCourse.findById(id);
    return dbRes;
};

// update offered course
const updateOfferedCourseIntoDB = async (
    id: string,
    payload: Pick<TOfferedCourse, "faculty" | "maxCapacity" | "days" | "startTime" | "endTime">
) => {
    const { faculty, days, startTime, endTime } = payload;

    // is offered course exist
    const isOfferedCourseExist = await OfferedCourse.findById(id);
    if (!isOfferedCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered course does not exist!");
    }
    const semesterRegistration = isOfferedCourseExist.semesterRegistration;

    // check the status of the offered course
    const semesterReg = await SemesterRegistration.findById(semesterRegistration).select("status");
    if (semesterReg?.status !== "UPCOMING") {
        throw new AppError(httpStatus.NOT_FOUND, `Cannot be updated as it is ${semesterReg?.status}`);
    }

    // is faculty exist
    const isFacultyExists = await Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Faculty does not exist!");
    }

    // get the schedules of the faculties
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days }
    }, {
        days: 1,
        startTime: 1,
        endTime: 1
    });
    const newSchedule = {
        days,
        startTime,
        endTime
    };

    if (hasTimeConfliction(assignedSchedules, newSchedule)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `This faculty is not available at that time! Choose other time or day.`
        );
    }

    // update offered course
    const dbRes = await OfferedCourse.findByIdAndUpdate(
        id,
        payload,
        {
            new: true,
            runValidators: true
        }
    );
    return dbRes;
};

// delete offered course
const deleteOfferedCourseFromDB = async (id: string) => {
    const offeredCourse = await OfferedCourse.findById(id);
    if (!offeredCourse) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered Course does not exist!");
    }

    const semesterRegistrationId = offeredCourse.semesterRegistration;
    const semesterRegistration = await SemesterRegistration.findById(semesterRegistrationId).select("status");
    if (semesterRegistration?.status !== "UPCOMING") {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Can not delete offered course! because it's semester is ${semesterRegistration?.status}`
        );
    }

    const dbRes = await OfferedCourse.findByIdAndDelete(id);
    return dbRes;
};

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    getMyOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
    deleteOfferedCourseFromDB
};
