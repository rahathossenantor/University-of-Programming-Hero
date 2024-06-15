import { Types } from "mongoose";

export type TPreRequisiteCourses = {
    course: Types.ObjectId;
    isDeleted: boolean;
};

export type TCourse = {
    name: string;
    prefix: string;
    code: number;
    credits: number;
    isDeleted: boolean;
    preRequisiteCourses: [TPreRequisiteCourses];
};
