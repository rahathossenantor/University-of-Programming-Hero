import { z } from "zod";

const NameCreationSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string()
});

export const AdminCreationValidationSchema = z.object({
    body: z.object({
        password: z.string(),
        admin: z.object({
            name: NameCreationSchema,
            gender: z.enum(["Male", "Female", "Other"]),
            designation: z.string(),
            dateOfBirth: z.string(),
            email: z.string().email(),
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

export const AdminUpdatationValidationSchema = z.object({
    body: z.object({
        admin: z.object({
            name: NameUpdatationSchema.optional(),
            gender: z.enum(["Male", "Female", "Other"]).optional(),
            designation: z.string().optional(),
            dateOfBirth: z.string().optional(),
            email: z.string().email().optional(),
            contactNo: z.string().optional(),
            emergencyContactNo: z.string().optional(),
            bloodGroup: z.enum(["A", "B", "AB", "O", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string().optional(),
            avatar: z.string().optional()
        })
    })
});

export const AdminValidations = {
    AdminCreationValidationSchema,
    AdminUpdatationValidationSchema
};
