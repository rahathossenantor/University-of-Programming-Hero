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
        type: String,
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

// checking is the academic semester exists or not
academicSemesterSchema.pre("save", async function (next) {
    const isSemesterExists = await AcademicSemester.findOne({
        year: this.year,
        name: this.name
    });

    if (isSemesterExists) {
        throw new Error("Academic semester is already exist!");
    }
    next();
});

// academic semester model
export const AcademicSemester = model<TAcademicSemester>("academicsemester", academicSemesterSchema);
