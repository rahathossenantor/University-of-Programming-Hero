import { Schema, model } from "mongoose";
import { TAcademicFaculty } from "./academicFaculty.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const academicFacultySchema = new Schema<TAcademicFaculty>({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

// checking is the document is exist or not
academicFacultySchema.pre("findOneAndUpdate", async function (next) {
    const query = this.getQuery();
    const isAcademicFacultyExist = await AcademicFaculty.findOne(query);

    if (!isAcademicFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Academic faculty does not exist!");
    }
    next();
});

export const AcademicFaculty = model<TAcademicFaculty>("AcademicFaculty", academicFacultySchema);
