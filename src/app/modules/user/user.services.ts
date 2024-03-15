import { TUser } from "./user.interface";
import { User } from "./user.model";
import config from "../../config";
import { TStudent } from "../student/student.interface";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
    const tempUser: Partial<TUser> = {};
    tempUser.id = "2024100001";
    tempUser.password = password || config.default_pass as string;
    tempUser.role = "student";

    // creating user in database
    const dbRes = await User.create(tempUser);
    console.log(dbRes);

    if (Object.keys(dbRes).length) {
        studentData.id = dbRes.id;
        studentData.user = dbRes._id
    }
};

export const UserServices = {
    createStudentIntoDB
};
