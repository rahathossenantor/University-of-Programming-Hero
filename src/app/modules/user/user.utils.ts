import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";

// get last student id
const getLastStudentId = async () => {
    const lastStudent = await User
        .findOne({ role: "student" }, { id: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();
    
    const studentId = lastStudent?.id.substring(6);
    return studentId;
};

// generate new student id
export const generateStudentId = async (payload: TAcademicSemester) => {
    const currentId = await getLastStudentId() || "0000";
    let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
    incrementId = `${payload.year}${payload.code}${incrementId}`;
    return incrementId;
};
