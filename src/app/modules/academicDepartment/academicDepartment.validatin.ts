import { z } from "zod";

export const AcademicDepartmentCreationValidationSchema = z.object({
    body: z.object({
        name: z.string(),
        academicFaculty: z.string()
    })
});

export const AcademicDepartmentUpdatationValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        academicFaculty: z.string().optional()
    })
});

export const AcademicDepartmentValidations = {
    AcademicDepartmentCreationValidationSchema,
    AcademicDepartmentUpdatationValidationSchema
};
