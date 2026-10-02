import { Carousel } from 'react-bootstrap';
import './image-carousel.css';

interface ImageCarouselProps {
    images: string[];
}

function ImageCarousel({ images }: ImageCarouselProps) {
    return (
        <Carousel className="ot-carousel" indicators={false}>
            {images.map((image, index) => (
                <Carousel.Item key={index}>
                    <div className="ot-carousel__slide ot-carousel__slide--image">
                        <img src={image} alt="" />
                    </div>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default ImageCarousel;
