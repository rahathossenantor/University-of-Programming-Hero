import { Schema, model } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";
import { academicSemesterCodes, academicSemesterNames, months } from "./academicSemester.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

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
        throw new AppError(httpStatus.BAD_REQUEST, `Academic semester ${this.name} ${this.year} is already exist!`);
    }
    next();
});

// checking is the document is exist or not before updating
academicSemesterSchema.pre("findOneAndUpdate", async function (next) {
    const query = this.getQuery();
    const isAcademicSemesterExist = await AcademicSemester.findOne(query);

    if (!isAcademicSemesterExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Academic semester does not exist!");
    }
    next();
});

// academic semester model
export const AcademicSemester = model<TAcademicSemester>("AcademicSemester", academicSemesterSchema);
