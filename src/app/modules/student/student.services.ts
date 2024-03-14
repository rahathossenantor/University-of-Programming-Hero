import { TStudent } from "./student.interface";
import { Student } from "./student.model";

const createStudentIntoDB = async (studentData: TStudent) => {
    // const response = await StudentModel.create(studentData);

    const student = new Student(studentData);
    if (await student.isUserExist(studentData.id)) {
        throw new Error("Student already exist!");
    }
    const response = await student.save();
    return response;
};

const getAllStudentsFromDB = async () => {
    // const response = await Student.find();
    const response = await Student.aggregate([
        {
            $match: {}
        }
    ]);
    return response;
};

const getSingleStudentFromDB = async (id: string) => {
    // const response = await Student.findOne({ id });
    const response = await Student.aggregate([
        {
            $match: { id }
        }
    ]);
    return response;
};

const deleteStudentFromDB = async (id: string) => {
    const response = await Student.updateOne({ id }, { isDeleted: true });
    return response;
};

export const StudentServices = {
    createStudentIntoDB,
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    deleteStudentFromDB
};
