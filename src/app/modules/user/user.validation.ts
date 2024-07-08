import { z } from "zod";

export const UserValidationSchema = z.object({
    password: z.string().max(20).optional()
});

export const UpdateUserStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum(["in-progress", "blocked"])
    })
});

export const UserValidations = {
    UserValidationSchema,
    UpdateUserStatusValidationSchema
};
