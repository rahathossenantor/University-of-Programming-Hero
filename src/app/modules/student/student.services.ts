import { Student } from "./student.model";

const getAllStudentsFromDB = async () => {
    const dbRes = await Student.find()
        .populate("academicSemester")
        .populate({ path: "academicDepartment", populate: { path: "academicFaculty" } })
        .populate("user");
    return dbRes;
};

const getSingleStudentFromDB = async (id: string) => {
    const dbRes = await Student.findOne({ id })
        .populate("academicSemester")
        .populate({ path: "academicDepartment", populate: { path: "academicFaculty" } })
        .populate("user");
    return dbRes;
};

const deleteStudentFromDB = async (id: string) => {
    const dbRes = await Student.updateOne({ id }, { isDeleted: true });
    return dbRes;
};

export const StudentServices = {
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    deleteStudentFromDB
};
