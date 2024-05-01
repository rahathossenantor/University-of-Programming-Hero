import { z } from "zod";

export const AcademicFacultyValidationSchema = z.object({
    body: z.object({
        name: z.string()
    })
});

export const AcademicFacultyValidations = {
    AcademicFacultyValidationSchema
};
