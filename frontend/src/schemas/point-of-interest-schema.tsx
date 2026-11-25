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
    images: z.any().optional(),
    existingImages: z.any().optional(),
    deletedImageIds: z.any().optional(),
}).superRefine((data, ctx) => {
    const existingCount = data.existingImages && typeof data.existingImages.length === "number"
        ? data.existingImages.length
        : 0;
    const selectedCount = data.images
        ? (typeof data.images.length === "number" ? data.images.length : 1)
        : 0;

    if (existingCount + selectedCount === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Debes seleccionar al menos una imagen",
            path: ["images"]
        });
    }

    if (selectedCount > 0) {
        const files = Array.isArray(data.images) || (typeof FileList !== "undefined" && data.images instanceof FileList)
            ? Array.from(data.images)
            : [data.images];

        if (!files.every((file: any) => file.size <= MAX_FILE_SIZE)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Cada imagen debe pesar menos de 15 MB",
                path: ["images"]
            });
        }
        if (!files.every((file: any) =>
            ACCEPTED_IMAGE_TYPES.includes(file.type) || (file.name && /\.(jpe?g|png|webp)$/i.test(file.name))
        )) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Solo se permiten imágenes JPG, PNG o WEBP",
                path: ["images"]
            });
        }
    }
});