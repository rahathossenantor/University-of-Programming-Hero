import { Student } from "./student.model";

const getAllStudentsFromDB = async () => {
    const res = await Student.find();
    return res;
};

const getSingleStudentFromDB = async (id: string) => {
    const res = await Student.findOne({ id });
    return res;
};

const deleteStudentFromDB = async (id: string) => {
    const res = await Student.updateOne({ id }, { isDeleted: true });
    return res;
};

export const StudentServices = {
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    deleteStudentFromDB
};
