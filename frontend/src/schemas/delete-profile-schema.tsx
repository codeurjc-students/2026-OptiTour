import { z } from "zod";

export const deleteProfileSchema = z.object({
    password: z.string().trim()
        .min(1, "La contraseña es obligatoria"),
    isConfirmed: z.boolean().refine((val) => val === true, {
        message: "Debes marcar la casilla para confirmar la eliminación de la cuenta."
    })
});

export type DeleteProfileFormData = z.infer<typeof deleteProfileSchema>;
