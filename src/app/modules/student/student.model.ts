import { Schema, model } from "mongoose";
import { TParents, TGuardian, TStudent, StudentModel } from "./student.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { nameSchema } from "../../schema/global.schema";
import { bloodGroupes, genders } from "../../constant/global.constant";

const parentsSchema = new Schema<TParents>({
    fatherName: {
        type: String,
        required: true
    },
    fatherOccupation: {
        type: String,
        required: true
    },
    fatherContactNo: {
        type: String,
        required: true
    },
    motherName: {
        type: String,
        required: true
    },
    motherOccupation: {
        type: String,
        required: true
    },
    motherContactNo: {
        type: String,
        required: true
    }
}, {
    _id: false
});

const guardianSchema = new Schema<TGuardian>({
    name: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
}, {
    _id: false
});

const studentSchema = new Schema<TStudent, StudentModel>({
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
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    academicSemester: {
        type: Schema.Types.ObjectId,
        ref: "AcademicSemester"
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
    parents: {
        type: parentsSchema,
        required: true
    },
    guardian: {
        type: guardianSchema,
        required: true
    },
    avatar: {
        type: String
    },
    isDeleted: { type: Boolean, default: false }
},
{
    toJSON: {
        virtuals: true
    }
});

// mongoose virtuals
studentSchema.virtual("fullName").get(function () {
    const fullName: string = `${this.name?.firstName}${this.name?.middleName && ` ${this.name?.middleName}`} ${this.name?.lastName}`;
    return fullName;
});

studentSchema.statics.isStudentExistByCustomId = async (id: string) => {
    return await Student.findOne({ id });
};

// query middlewares
studentSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

studentSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// checking is the document is exist or not
studentSchema.pre("findOneAndUpdate", async function (next) {
    const query = this.getQuery();
    const isStudentExist = await Student.findOne(query);

    if (!isStudentExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Student does not exist!");
    }
    next();
});

studentSchema.pre("aggregate", function (next) {
    this.pipeline().unshift(
        {
            $match: { isDeleted: { $ne: true } }
        }
    );
    next();
});

export const Student = model<TStudent, StudentModel>("Student", studentSchema);
