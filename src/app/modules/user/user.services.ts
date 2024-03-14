import { TTempUser } from "./user.interface";
import { User } from "./user.model";
import config from "../../config";

const createStudentIntoDB = async (password: string, studentData: any) => {
    const tempUser: TTempUser = {
        id: "",
        password: ""
    };
    tempUser.id = "2024100001";
    tempUser.password = password || config.default_pass as string;

    // creating user in database
    const dbRes = await User.create(tempUser);
    if (Object.keys(dbRes).length) {
        studentData.id = dbRes.id;
        studentData.user = dbRes._id
    };
};

export const UserServices = {
    createStudentIntoDB
};
