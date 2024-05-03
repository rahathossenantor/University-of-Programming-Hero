import { Schema, model } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";

const academicDepartmentSchema = new Schema<TAcademicDepartment>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        ref: "AcademicFaculty"
    }
}, { timestamps: true });

// checking is the document is exist or not
academicDepartmentSchema.pre("save", async function (next) {
    const isAcademicDepartmentExist = await AcademicDepartment.findOne({ name: this.name });

    if (isAcademicDepartmentExist) {
        throw new Error(`${this.name} is already exist!`);
    }
    next();
});

// checking is the document is exist or not before updating
academicDepartmentSchema.pre("findOneAndUpdate", async function (next) {
    const query = this.getQuery();
    const isAcademicDepartmentExist = await AcademicDepartment.findOne(query);

    if (!isAcademicDepartmentExist) {
        throw new Error("Academic department does not exist!");
    }
    next();
});

export const AcademicDepartment = model<TAcademicDepartment>("academicdepartment", academicDepartmentSchema);
