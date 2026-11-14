import z from "zod";

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const poiSchema = z.object({
    name: z.string().trim()
        .min(1, "El nombre es obligatorio")
        .max(30, "El nombre no puede superaro los 30 caracteres"),
    desc: z.string().trim()
        .min(1, "La descripción es obligatoria")
        .max(300, "La descripción no puede superar los 300 caracteres"),
    city: z.string().trim()
        .min(1, "La ciudad es obligatoria")
        .max(30, "La ciudad no puede superar los 30 caracteres"),
    address: z.string().trim()
        .min(1, "La dirección es obligatoria")
        .max(60, "La dirección no puede superar los 60 caracteres"),
    lat: z.string().trim()
        .min(1, "La latitud es obligatoria")
        .regex(/^-?\d{1,2}\.\d+$/, "Debe ser un número decimal (ej: 40.4168)"),
    lng: z.string().trim()
        .min(1, "La longitud es obligatoria")
        .regex(/^-?\d{1,3}\.\d+$/, "Debe ser un número decimal (ej: -3.7038)")
        .min(1, "Debes introducir la contraseña de nuevo."),
    images: z.any()
        .refine((files) => files && files.length > 0, "Debes seleccionar al menos una imagen")
        // For image management, we can use file native file list created in dom
        .refine((files) => files && Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
            "Cada imagen debe pesar menos de 15 MB")
        .refine((files) => files && Array.from(files).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
            "Solo se permiten imágenes JPG, PNG o WEBP")
});