import { Schema, model } from "mongoose";
import { TAcademicFaculty } from "./academicFaculty.interface";

const academicFacultySchema = new Schema<TAcademicFaculty>({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

// checking is the document is exist or not before updating
academicFacultySchema.pre("findOneAndUpdate", async function (next) {
    const query = this.getQuery();
    const isAcademicFacultyExist = await AcademicFaculty.findOne(query);

    if (!isAcademicFacultyExist) {
        throw new Error("Academic faculty does not exist!");
    }
    next();
});

export const AcademicFaculty = model<TAcademicFaculty>("academicfaculty", academicFacultySchema);
