import { Schema, model } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";
import { academicSemesterCodes, academicSemesterNames, months } from "./academicSemester.constants";

// academic semester schema
const academicSemesterSchema = new Schema<TAcademicSemester>({
    name: {
        type: String,
        required: true,
        enum: academicSemesterNames
    },
    code: {
        type: String,
        required: true,
        enum: academicSemesterCodes
    },
    year: {
        type: Date,
        required: true
    },
    startMonth: {
        type: String,
        required: true,
        enum: months
    },
    endMonth: {
        type: String,
        required: true,
        enum: months
    }
});

// academic semester model
export const AcademicSemester = model<TAcademicSemester>("academicSemester", academicSemesterSchema);
