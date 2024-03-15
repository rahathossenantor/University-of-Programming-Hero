import { TUser } from "./user.interface";
import { User } from "./user.model";
import config from "../../config";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
    const tempUser: Partial<TUser> = {};
    tempUser.id = "2024100001";
    tempUser.password = password || config.default_pass as string;
    tempUser.role = "student";

    // creating user in database
    const dbRes = await User.create(tempUser);

    if (Object.keys(dbRes).length) {
        studentData.id = dbRes.id;
        studentData.user = dbRes._id;
        const newStudent = await Student.create(studentData);
        return newStudent;
    }
};

export const UserServices = {
    createStudentIntoDB
};
