import { Schema, model } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";

const semesterSchema = new Schema<TAcademicSemester>({
    name: {
        type: String,
        enum: ["Autumn", "Summar", "Fall"]
    },
    code: {
        type: String,
        enum: ["01", "02", "03"]
    },
    year: {
        type: Date,
        required: true
    },
    startMonth: {
        type: String,
        enum: ["January", "February", "March", "April", "May", "Jun", "July", "August", "September", "Octobar", "November", "December"]
    },
    endMonth: {
        type: String,
        enum: ["January", "February", "March", "April", "May", "Jun", "July", "August", "September", "Octobar", "November", "December"]
    }
});

export const Semester = model<TAcademicSemester>("semester", semesterSchema);
