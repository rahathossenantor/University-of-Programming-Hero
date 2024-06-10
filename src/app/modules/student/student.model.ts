import { Schema, model } from "mongoose";
import { TName, TParents, TGuardian, TStudent, TStudentModel, TStudentMethods } from "./student.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const nameSchema = new Schema<TName>({
    firstName: {
        type: String,
        required: true,
        validate: {
            validator: (fName: string) => {
                const splittedName = fName.trim().split(" ");
                const capitalizedName = splittedName.map(word => (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()));
                const userName = capitalizedName.join(" ");
                return userName === fName;
            },
            message: props => `${props.value} is not a valid format!`
        }
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String,
        required: true,
        validate: {
            validator: (lName: string) => {
                const splittedName = lName.trim().split(" ");
                const capitalizedName = splittedName.map(word => (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()));
                const userName = capitalizedName.join(" ");
                return userName === lName;
            },
            message: props => `${props.value} is not a valid format!`
        }
    }
});

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
});

const studentSchema = new Schema<TStudent, TStudentModel, TStudentMethods>({
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
        enum: ["male", "female", "other"],
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
        enum: [
            "A",
            "B",
            "AB",
            "O",
            "A+",
            "A-",
            "B+",
            "B-",
            "AB+",
            "AB-",
            "O+",
            "O-",
        ]
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
}, {
    toJSON: {
        virtuals: true
    }
});

// mongoose virtuals
studentSchema.virtual("fullName").get(function () {
    const fullName: string = `${this.name?.firstName}${this.name?.middleName && ` ${this.name?.middleName}`} ${this.name?.lastName}`;
    return fullName;
});

studentSchema.methods.isUserExist = async function (id: string) {
    const existingStudent = await Student.findOne({ id });
    return existingStudent;
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

// student model
const Student = model<TStudent, TStudentModel>("Student", studentSchema);

export { Student };
