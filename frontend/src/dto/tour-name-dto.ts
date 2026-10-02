import type { ImageDTO } from "./image-dto";

export interface TourNameDTO {
    id: number,
    name: string,
    images: ImageDTO[]
}