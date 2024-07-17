import { Schema, model } from "mongoose";
import { AdminModel, TAdmin } from "./admin.interface";
import { nameSchema } from "../../schema/global.schema";
import { bloodGroupes, genders } from "../../constant/global.constant";

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

adminSchema.statics.isAdminExist = async function (id: string) {
  return await Admin.findOne({ id });
};

export const Admin = model<TAdmin, AdminModel>("Admin", adminSchema);
