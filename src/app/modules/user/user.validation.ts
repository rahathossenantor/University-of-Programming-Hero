import { z } from "zod";

export const UserValidationSchema = z.object({
    password: z.string().max(20).optional()
});

export const UserValidations = {
    UserValidationSchema
};
