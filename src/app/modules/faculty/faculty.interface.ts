/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export type TName = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

export type TGender = "male" | "female" | "other";

type TBloodGroup =
    | "A"
    | "B"
    | "AB"
    | "O"
    | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "AB+"
    | "AB-"
    | "O+"
    | "O-";

export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TName;
  gender: TGender;
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  avatar?: string;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};

export interface FacultyModel extends Model<TFaculty> {
  isUserExists(id: string): Promise<TFaculty | null>;
}
