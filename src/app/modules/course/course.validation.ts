import { z } from "zod";

const PreRequisiteCourseSchema = z.object({
    course: z.string(),
    isDeleted: z.boolean().optional()
});

const CourseCreationValidationSchema = z.object({
    body: z.object({
        name: z.string(),
        prefix: z.string(),
        code: z.number(),
        credits: z.number(),
        preRequisiteCourses: z.array(PreRequisiteCourseSchema).optional(),
        isDeleted: z.boolean().optional()
    })
});

const CourseUpdatationValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        prefix: z.string().optional(),
        code: z.number().optional(),
        credits: z.number().optional(),
        preRequisiteCourses: z
            .array(PreRequisiteCourseSchema)
            .optional(),
        isDeleted: z.boolean().optional()
    })
});

const FacultiesWithCourseValidationSchema = z.object({
    body: z.object({
        faculties: z.array(z.string())
    })
});

export const CourseValidations = {
    CourseCreationValidationSchema,
    CourseUpdatationValidationSchema,
    FacultiesWithCourseValidationSchema
};
