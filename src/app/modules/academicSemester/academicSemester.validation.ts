import { z } from "zod";
import { academicSemesterCodes, academicSemesterNames, months } from "./academicSemester.constants";

// academic semester creation schema
export const AcademicSemesterCreationValidationSchema = z.object({
    body: z.object({
        name: z.enum([...academicSemesterNames] as [string, ...string[]]),
        code: z.enum([...academicSemesterCodes] as [string, ...string[]]),
        year: z.string(),
        startMonth: z.enum([...months] as [string, ...string[]]),
        endMonth: z.enum([...months] as [string, ...string[]])
    })
});

// academic semester updatation schema
export const AcademicSemesterUpdatationValidationSchema = z.object({
    body: z.object({
        name: z.enum([...academicSemesterNames] as [string, ...string[]]).optional(),
        code: z.enum([...academicSemesterCodes] as [string, ...string[]]).optional(),
        year: z.string().optional(),
        startMonth: z.enum([...months] as [string, ...string[]]).optional(),
        endMonth: z.enum([...months] as [string, ...string[]]).optional()
    })
});

export const AcademicSemesterValidations = {
    AcademicSemesterCreationValidationSchema,
    AcademicSemesterUpdatationValidationSchema
};
