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
            gender: z.enum(["male", "female", "other"]),
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


export const AdminValidations = {
    AdminCreationValidationSchema,
    AdminUpdatationValidationSchema
};
