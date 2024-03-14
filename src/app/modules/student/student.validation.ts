import { z } from "zod";

// Define Zod schema for Name
const NameSchema = z.object({
    firstName: z.string()
        .min(2, { message: "First name must be at least 2 characters long." })
        .max(20, { message: "First name cannot exceed 20 characters." })
        .refine(value => {
            const capitalizedName = value.trim().split(" ").map(word => (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())).join(" ");
            return capitalizedName === value;
        }, { message: "First name is not in a valid format." }),
    middleName: z.string().max(20, { message: "Middle name cannot exceed 20 characters." }).optional(),
    lastName: z.string()
        .min(2, { message: "Last name must be at least 2 characters long." })
        .max(20, { message: "Last name cannot exceed 20 characters." })
        .refine(value => {
            const capitalizedName = value.trim().split(" ").map(word => (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())).join(" ");
            return capitalizedName === value;
        }, { message: "Last name is not in a valid format." })
});

// Define Zod schema for Parents
const ParentsSchema = z.object({
    fatherName: z.string().min(1, { message: "Father's name is required!" }),
    fatherOccupation: z.string().min(1, { message: "Father's occupation is required!" }),
    fatherContactNo: z.string().min(1, { message: "Father's contact number is required!" }),
    motherName: z.string().min(1, { message: "Mother's name is required!" }),
    motherOccupation: z.string().min(1, { message: "Mother's occupation is required!" }),
    motherContactNo: z.string().min(1, { message: "Mother's contact number is required!" })
});

// Define Zod schema for Guardian
const GuardianSchema = z.object({
    name: z.string().min(1, { message: "Guardian's name is required!" }),
    occupation: z.string().min(1, { message: "Guardian's occupation is required!" }),
    contactNo: z.string().min(1, { message: "Guardian's contact number is required!" }),
    address: z.string().min(1, { message: "Guardian's address is required!" })
});

// Define Zod schema for Student
const zodStudentValidationSchema = z.object({
    id: z.string(),
    user: z.string(),
    password: z.string(),
    name: NameSchema,
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z.string().min(1, { message: "Date of birth is required!" }),
    email: z.string().email({ message: "Email must be a valid email address!" }).min(1, { message: "Email is required!" }),
    contactNo: z.string().min(1, { message: "Contact number is required!" }),
    emergencyContactNo: z.string().min(1, { message: "Emergency contact number is required!" }),
    bloodGroup: z.enum(["A", "B", "AB", "O", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().min(1, { message: "Permanent address is required!" }),
    parents: ParentsSchema,
    guardian: GuardianSchema,
    avatar: z.string().optional(),
    isActive: z.enum(["active", "blocked"]).default("active"),
    isDeleted: z.boolean().default(false)
});

export default zodStudentValidationSchema;
