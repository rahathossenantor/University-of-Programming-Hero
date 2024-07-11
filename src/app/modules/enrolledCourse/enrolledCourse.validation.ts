import { z } from "zod";

const EnrolledCourseCreationValidationSchema = z.object({
    body: z.object({
        offeredCourse: z.string()
    })
});

export const EnrolledCourseValidations = {
    EnrolledCourseCreationValidationSchema
};
