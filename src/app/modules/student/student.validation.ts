import { z } from "zod";

// creation schemas
// Define Zod schema for Name
const NameCreationSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string()
});

// Define Zod schema for Parents
const ParentsCreationSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContactNo: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContactNo: z.string()
});

// Define Zod schema for Guardian
const GuardianCreationSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNo: z.string(),
    address: z.string()
});

// Define Zod schema for Student
export const StudentCreationValidationSchema = z.object({
    body: z.object({
        password: z.string().optional(),
        student: z.object({
            name: NameCreationSchema,
            gender: z.enum(["male", "female", "other"]),
            dateOfBirth: z.string(),
            email: z.string().email(),
            academicSemester: z.string(),
            academicDepartment: z.string(),
            contactNo: z.string(),
            emergencyContactNo: z.string(),
            bloodGroup: z.enum(["A", "B", "AB", "O", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string(),
            parents: ParentsCreationSchema,
            guardian: GuardianCreationSchema
        })
    })
});

// updatation schemas
// Define Zod schema for Name
const NameUpdatationSchema = z.object({
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional()
});

// Define Zod schema for Parents
const ParentsUpdatationSchema = z.object({
    fatherName: z.string().optional(),
    fatherOccupation: z.string().optional(),
    fatherContactNo: z.string().optional(),
    motherName: z.string().optional(),
    motherOccupation: z.string().optional(),
    motherContactNo: z.string().optional()
});

// Define Zod schema for Guardian
const GuardianUpdatationSchema = z.object({
    name: z.string().optional(),
    occupation: z.string().optional(),
    contactNo: z.string().optional(),
    address: z.string().optional()
});

// Define Zod schema for Student
export const StudentUpdatationValidationSchema = z.object({
    body: z.object({
        student: z.object({
            name: NameUpdatationSchema.optional(),
            gender: z.enum(["male", "female", "other"]).optional(),
            dateOfBirth: z.string().optional(),
            email: z.string().email().optional(),
            academicSemester: z.string().optional(),
            academicDepartment: z.string().optional(),
            contactNo: z.string().optional(),
            emergencyContactNo: z.string().optional(),
            bloodGroup: z.enum(["A", "B", "AB", "O", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string().optional(),
            parents: ParentsUpdatationSchema.optional(),
            guardian: GuardianUpdatationSchema.optional()
        })
    })
});

export const StudentValidations = {
    StudentCreationValidationSchema,
    StudentUpdatationValidationSchema
};
