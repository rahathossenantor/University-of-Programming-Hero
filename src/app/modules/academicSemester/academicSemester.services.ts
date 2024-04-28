import { academicSemesterNameCodeMapper } from "./academicSemester.constants";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

// create an academic semester in the database
const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error("Invalid semester code!");
    }

    const dbRes = await AcademicSemester.create(payload);
    return dbRes;
};

// get all academic semesters from the database
const getAllAcademicSemestersFromDB = async () => {
    const dbRes = await AcademicSemester.find();
    return dbRes;
};

// get single academic semester from the database
const getSingleAcademicSemesterFromDB = async (id: string) => {
    const dbRes = await AcademicSemester.findById(id);
    return dbRes;
};

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemestersFromDB,
    getSingleAcademicSemesterFromDB
};
