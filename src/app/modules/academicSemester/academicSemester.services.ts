import { academicSemesterNameCodeMapper } from "./academicSemester.constants";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error("Invalid semester code!");
    }

    const dbRes = await AcademicSemester.create(payload);
    return dbRes;
};

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB
};
