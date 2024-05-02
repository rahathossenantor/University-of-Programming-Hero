import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFaculty } from "./academicFaculty.model";

// create an academic faculty
const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
    const dbRes = await AcademicFaculty.create(payload);
    return dbRes;
};

// update academic faculty by id
const updateAcademicFacultyIntoDB = async (
    id: string,
    payload: Partial<TAcademicFaculty>,
) => {
    const dbRes = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, { new: true });
    return dbRes;
};

// get all academic faculties
const getAllAcademicFacultiesFromDB = async () => {
    const dbRes = await AcademicFaculty.find();
    return dbRes;
};

// get single academic faculty
const getSingleAcademicFacultyFromDB = async (id: string) => {
    const dbRes = await AcademicFaculty.findById(id);
    return dbRes;
};

export const AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
    updateAcademicFacultyIntoDB,
    getAllAcademicFacultiesFromDB,
    getSingleAcademicFacultyFromDB
};
