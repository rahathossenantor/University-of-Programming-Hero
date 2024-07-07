export type TName = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

export type TGender = "male" | "female" | "other";

export type TBloodGroup =
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
