import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().trim()
        .min(1, "El email es obligatorio.")
        .max(30, "El email no puede superar los 30 caracteres.")
        .email("El formato del correo no es válido. (Comprueba que contiene '@' y '.')"),
    password: z.string().trim()
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .max(20, "La contraseña no puede superar los 20 caracteres.")
});