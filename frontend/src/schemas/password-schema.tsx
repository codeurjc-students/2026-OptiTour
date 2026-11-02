import z from "zod";

export const passwordSchema = z.object({
    password: z.string().trim()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(20, "La contraseña no puede superar los 20 caracteres")
});
