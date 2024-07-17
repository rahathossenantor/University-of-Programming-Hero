import { Schema, model } from "mongoose";
import { FacultyModel, TFaculty } from "./faculty.interface";
import { nameSchema } from "../../schema/global.schema";
import { bloodGroupes, genders } from "../../constant/global.constant";

const facultySchema = new Schema<TFaculty, FacultyModel>(
    {
        id: {
            type: String,
            unique: true
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: "User"
        },
        designation: {
            type: String,
            required: true,
        },
        name: {
            type: nameSchema,
            required: true
        },
        gender: {
            type: String,
            enum: genders,
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        academicDepartment: {
            type: Schema.Types.ObjectId,
            ref: "AcademicDepartment"
        },
        contactNo: {
            type: String,
            required: true
        },
        emergencyContactNo: {
            type: String,
            required: true
        },
        bloodGroup: {
            type: String,
            enum: bloodGroupes
        },
        presentAddress: {
            type: String
        },
        permanentAddress: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: ""
        },
        isDeleted: { type: Boolean, default: false }
    },
    {
        toJSON: {
            virtuals: true
        }
    }
);

facultySchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

facultySchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

facultySchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

facultySchema.statics.isFacultyExist = async function (id: string) {
    return await Faculty.findOne({ id });
};

export const Faculty = model<TFaculty, FacultyModel>("Faculty", facultySchema);
