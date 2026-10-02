import type { ImageDTO } from "./image-dto";
import type { PointOfInterestDTO } from "./point-of-interest-dto";

export interface TourDTO {
    id: number,
    name: string,
    description: string,
    pois: PointOfInterestDTO[];
    images: ImageDTO[]
}