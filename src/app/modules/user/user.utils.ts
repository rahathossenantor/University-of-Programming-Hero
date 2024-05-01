import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";

// get last student id
const getLastStudentId = async () => {
    const lastStudent = await User
        .findOne({ role: "student" }, { id: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();
    return lastStudent?.id;
};

// generate new student id
export const generateStudentId = async (payload: TAcademicSemester) => {
    let currentId = "0000";
    const lastStudentId = await getLastStudentId();
    const lastStudentSemesterYear = lastStudentId?.substring(0, 4);
    const lastStudentSemesterCode = lastStudentId?.substring(4, 6);

    if (
        lastStudentId &&
        lastStudentSemesterYear === payload.year &&
        lastStudentSemesterCode === payload.code
    ) {
        currentId = lastStudentId.substring(6);
    }

    let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
    incrementId = `${payload.year}${payload.code}${incrementId}`;
    return incrementId;
};
