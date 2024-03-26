import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    const dbRes = await AcademicSemester.create(payload);
    return dbRes;
};

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB
};
