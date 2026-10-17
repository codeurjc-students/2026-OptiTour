import { z } from 'zod';

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const signupSchema = z.object({
    email: z.string().trim()
        .min(1, "El email es obligatorio")
        .max(30, "El email no puede superar los 30 caracteres")
        .email("El formato del correo no es válido. (Comprueba que contiene '@' y '.')"),
    phone: z.preprocess(
        (value) => typeof value === "string" && value.trim() === "" ? undefined : value,
        z.string()
            .max(12, "El teléfono no puede superar los 12 caracteres")
            .regex(new RegExp("^\\+?[0-9 ]+$"), "El teléfono solo puede contener números y el prefijo '+'")
            .optional()
    ),
    userName: z.string().trim()
        .min(1, "El nombre de usuario es obligatorio")
        .min(5, "El nombre de usuario debe tener al menos 5 caracteres")
        .max(20, "El nombre de usuario no puede superar los 20 caracteres"),
    password: z.string().trim()
        .min(1, "La contraseña es obligatoria")
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .max(20, "La contraseña no puede superar los 20 caracteres.")
        .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$"),
            "La contraseña debe contener al menos una mayúscula, una minúscula y un número."),
    repeatPassword: z.string().trim()
        .min(1, "Debes introducir la contraseña de nuevo."),
    image: z.any()
        .optional()
        // For image management, we can use file native file list created in dom
        .refine((files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE, "")
        .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type))
}).refine(
    (data) => data.password == data.repeatPassword,
    {
        message: "Las contraseñas no coinciden",
        path: ["repeatPassword"]
    }
);