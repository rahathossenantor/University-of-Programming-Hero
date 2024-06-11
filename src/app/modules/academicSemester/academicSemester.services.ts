import { academicSemesterNameCodeMapper } from "./academicSemester.constants";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

// create an academic semester
const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error("Invalid semester code!");
    }
    const dbRes = await AcademicSemester.create(payload);
    return dbRes;
};

// update academic semester by id
const updateAcademicSemesterIntoDB = async (
    id: string,
    payload: Partial<TAcademicSemester>,
) => {
    if (
        payload.name &&
        payload.code &&
        academicSemesterNameCodeMapper[payload.name] !== payload.code
    ) {
        throw new Error("Invalid semester code!");
    }
    const dbRes = await AcademicSemester.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return dbRes;
};

// get all academic semesters
const getAllAcademicSemestersFromDB = async () => {
    const dbRes = await AcademicSemester.find();
    return dbRes;
};

// get single academic semester
const getSingleAcademicSemesterFromDB = async (id: string) => {
    const dbRes = await AcademicSemester.findById(id);
    return dbRes;
};

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    updateAcademicSemesterIntoDB,
    getAllAcademicSemestersFromDB,
    getSingleAcademicSemesterFromDB
};
