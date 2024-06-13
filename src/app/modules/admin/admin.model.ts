import { Schema, model } from "mongoose";
import { AdminModel, TAdmin, TName } from "./admin.interface";

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

const adminSchema = new Schema<TAdmin, AdminModel>(
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
      enum: ["male", "female", "other"],
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
    avatar: {
      type: String
    },
    isDeleted: { type: Boolean, default: false }
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);

adminSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

adminSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Admin.findOne({ id });
  return existingUser;
};

export const Admin = model<TAdmin, AdminModel>("Admin", adminSchema);
