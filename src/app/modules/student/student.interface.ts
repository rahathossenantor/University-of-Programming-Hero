import { Model, Types } from "mongoose";
import { TBloodGroup, TGender, TName } from "../../interface/global.interface";

export type TParents = {
    fatherName: string;
    fatherOccupation: string;
    fatherContactNo: string;
    motherName: string;
    motherOccupation: string;
    motherContactNo: string;
};

export type TGuardian = {
    name: string;
    occupation: string;
    contactNo: string;
    address: string;
};

export type TStudent = {
    id: string;
    user: Types.ObjectId;
    name: TName;
    gender: TGender;
    dateOfBirth: string;
    email: string;
    academicSemester: Types.ObjectId,
    academicDepartment: Types.ObjectId,
    contactNo: string;
    emergencyContactNo: string;
    bloodGroup?: TBloodGroup;
    presentAddress?: string;
    permanentAddress: string;
    parents: TParents;
    guardian: TGuardian;
    avatar?: string;
    isDeleted: boolean;
};

export type TStudentMethods = {
    // eslint-disable-next-line no-unused-vars
    isUserExist(id: string): Promise<TStudent | null>;
};

export type TStudentModel = Model<TStudent, Record<string, never>, TStudentMethods>;
