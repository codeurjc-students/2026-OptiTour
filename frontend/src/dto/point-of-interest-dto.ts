import type { ImageDTO } from "./image-dto";
import type { TourNameDTO } from "./tour-name-dto";

export interface PointOfInterestDTO {
    id: number,
    name: string,
    description: string,
    city: string,
    address: string,
    coords: string,
    tours: TourNameDTO[],
    images: ImageDTO[]
}