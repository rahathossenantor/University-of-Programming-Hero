import { z } from "zod";

const NameCreationSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string()
});

export const FacultyCreationValidationSchema = z.object({
    body: z.object({
        password: z.string(),
        faculty: z.object({
            name: NameCreationSchema,
            gender: z.enum(["male", "female", "other"]),
            designation: z.string(),
            dateOfBirth: z.string(),
            email: z.string().email(),
            academicDepartment: z.string(),
            contactNo: z.string(),
            emergencyContactNo: z.string(),
            bloodGroup: z.enum(["A", "B", "AB", "O", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string(),
            avatar: z.string().optional()
        })
    })
});

const NameUpdatationSchema = z.object({
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional()
});

export const FacultyUpdatationValidationSchema = z.object({
    body: z.object({
        faculty: z.object({
            name: NameUpdatationSchema.optional(),
            gender: z.enum(["male", "female", "other"]).optional(),
            designation: z.string().optional(),
            dateOfBirth: z.string().optional(),
            email: z.string().email().optional(),
            academicDepartment: z.string().optional(),
            contactNo: z.string().optional(),
            emergencyContactNo: z.string().optional(),
            bloodGroup: z.enum(["A", "B", "AB", "O", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string().optional(),
            avatar: z.string().optional()
        })
    })
});

export const FacultyValidations = {
    FacultyCreationValidationSchema,
    FacultyUpdatationValidationSchema
};
