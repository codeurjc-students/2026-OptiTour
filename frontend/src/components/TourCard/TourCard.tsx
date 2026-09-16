import { Card } from 'react-bootstrap';
import { Link } from 'react-router';
import './TourCard.css';

interface TourCardProps {
  title: string;
  imageSrc?: string;
  to?: string;
}

function TourCard({ title, imageSrc, to = '#' }: TourCardProps) {
  return (
    <Card className="ot-tour-card">
      <div className="ot-tour-card__image">
        {imageSrc ? (
          <img src={imageSrc} alt={title} />
        ) : (
          <span className="ot-tour-card__placeholder">Imagen<br />{title}</span>
        )}
      </div>
      <Card.Body className="ot-tour-card__body">
        <Card.Title className="ot-tour-card__title">{title}</Card.Title>
        <Link to={to} className="btn btn-outline-success ot-tour-card__btn">
          Ver más
        </Link>
      </Card.Body>
    </Card>
  );
}

export default TourCard;
