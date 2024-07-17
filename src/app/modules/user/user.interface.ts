/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { userRoles } from "./user.constant";

export interface TUser {
    id: string;
    email: string;
    password: string;
    needsPasswordChange: boolean;
    passwordChangedAt?: Date;
    role: "super-admin" | "admin" | "faculty" | "student";
    status: "in-progress" | "blocked";
    isDeleted: boolean;
}

export type TUserRoles = keyof typeof userRoles;

export interface UserModel extends Model<TUser> {
    isUserExist(id: string): Promise<TUser>;
    isUserExistByCustomId(id: string): Promise<TUser>;
    isPasswordMatched(plainTextPass: string, hasPass: string): Promise<boolean>;
    isJWTIssuedBeforePasswordChange(passwordChangeTime: Date, jwtIssuedTime: number): boolean
}
