import { TUser } from "./user.interface";
import { User } from "./user.model";
import config from "../../config";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { generateStudentId } from "./user.utils";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
    const userData: Partial<TUser> = {};
    userData.password = password || config.default_pass as string;
    userData.role = "student";

    // get academic semester data for generating student id
    const academicSemester = await AcademicSemester.findById(payload.admissionSemester);
    userData.id = await generateStudentId(academicSemester as TAcademicSemester);

    // creating user in database
    const dbRes = await User.create(userData);

    if (Object.keys(dbRes).length) {
        payload.id = dbRes.id;
        payload.user = dbRes._id;
        const newStudent = await Student.create(payload);
        return newStudent;
    }
};

export const UserServices = {
    createStudentIntoDB
};
