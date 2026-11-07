import { z } from "zod";

export const passwordEditSchema = z.object({
    oldPassword: z.string().trim()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(20, "La contraseña no puede superar los 20 caracteres"),
    password: z.string().trim()
        .min(1, "La contraseña es obligatoria")
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .max(20, "La contraseña no puede superar los 20 caracteres.")
        .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$"),
            "La contraseña debe contener al menos una mayúscula, una minúscula y un número."),
    repeatPassword: z.string().trim()
        .min(1, "Debes introducir la contraseña de nuevo."),
});