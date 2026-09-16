import { Carousel } from 'react-bootstrap';
import './ImageCarousel.css';

export interface CarouselSlide {
    title: string;
    eyebrow?: string;
    imageSrc?: string;
    variant?: 'primary' | 'dark';
}

interface ImageCarouselProps {
    slides: CarouselSlide[];
    className?: string;
}

function ImageCarousel({ slides, className = '' }: ImageCarouselProps) {
    return (
        <Carousel className={`ot-carousel ${className}`} indicators={false}>
            {slides.map((slide, index) => (
                <Carousel.Item key={index}>
                    {slide.imageSrc ? (
                        <div className="ot-carousel__slide ot-carousel__slide--image">
                            <img src={slide.imageSrc} alt={slide.title} />
                            {(slide.eyebrow || slide.title) && (
                                <div className="ot-carousel__slide-caption">
                                    {slide.eyebrow && <span className="ot-carousel__slide-eyebrow">{slide.eyebrow}</span>}
                                    <h2 className="ot-carousel__slide-title">{slide.title}</h2>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={`ot-carousel__slide ot-carousel__slide--${slide.variant ?? 'primary'}`}>
                            {slide.eyebrow && <span className="ot-carousel__slide-eyebrow">{slide.eyebrow}</span>}
                            <h2 className="ot-carousel__slide-title">{slide.title}</h2>
                        </div>
                    )}
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default ImageCarousel;