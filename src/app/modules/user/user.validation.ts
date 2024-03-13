import { z } from "zod";

export const userValidationSchema = z.object({
    password: z.string().max(20).optional()
});
