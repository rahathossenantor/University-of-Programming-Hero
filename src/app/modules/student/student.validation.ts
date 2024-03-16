import { z } from "zod";

// Define Zod schema for Name
const NameSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string()
});

// Define Zod schema for Parents
const ParentsSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContactNo: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContactNo: z.string()
});

// Define Zod schema for Guardian
const GuardianSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNo: z.string(),
    address: z.string()
});

// Define Zod schema for Student
const zodStudentValidationSchema = z.object({
    id: z.string(),
    user: z.string(),
    name: NameSchema,
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z.string(),
    email: z.string().email(),
    contactNo: z.string(),
    emergencyContactNo: z.string(),
    bloodGroup: z.enum(["A", "B", "AB", "O", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string(),
    parents: ParentsSchema,
    guardian: GuardianSchema,
    avatar: z.string().optional(),
    isDeleted: z.boolean().default(false)
});

export default zodStudentValidationSchema;
