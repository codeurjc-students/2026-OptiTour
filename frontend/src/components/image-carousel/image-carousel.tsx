import { Button, Carousel } from 'react-bootstrap';
import logo from '../../assets/OptiTourLogo.png';
import './image-carousel.css';
import type { TourDTO } from '../../dto/tour-dto';

const base_url = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}` : "https://localhost:443/api/v1";

interface ImageCarouselProps {
    images?: string[];
    tours?: TourDTO[];
}

function ImageCarousel({ images, tours }: ImageCarouselProps) {
    return (
        <Carousel className="ot-carousel" indicators>
            {images ? images?.map((image, index) => (
                <Carousel.Item key={index}>
                    <div className="ot-carousel__slide ot-carousel__slide--image">
                        <img src={image} alt="Imagen del tour o punto de interés" />
                    </div>
                </Carousel.Item>
            ))
                :
                tours?.map((tour, index) => (
                    <Carousel.Item key={index}>
                        <div className="ot-carousel__slide ot-carousel__slide--image">
                            <div className="ot-login__visual-content">
                                <img src={logo} alt="OptiTour" className="ot-login__visual-logo" />
                                <p className="ot-carousel__slide-title">
                                    {tour.name}
                                </p>
                                <p className="ot-login__visual-tagline">
                                    {tour.description}
                                </p>
                                <Button
                                    as="a"
                                    href={`/tour/${tour.id}`}
                                    className="ot-carousel__slide-button"
                                >
                                    Ver más
                                </Button>
                            </div>
                            <img src={`${base_url}/image/${tour.images[0].id}`} alt={`imagen del tour ${tour.id}`} />
                        </div>
                    </Carousel.Item>
                ))
            }
        </Carousel>
    );
}

export default ImageCarousel;
