import { Card } from 'react-bootstrap';
import { Link } from 'react-router';
import './tour-card.css';

interface TourCardProps {
  title: string;
  desc: string;
  imageSrc?: string;
  to?: string;
}

function TourCard({ title, desc, imageSrc, to = '#' }: TourCardProps) {
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
        <p className="ot-tour-desc">{desc}</p>
        <Link to={to} className="btn btn-outline-success ot-tour-card__btn">
          Ver más
        </Link>
      </Card.Body>
    </Card>
  );
}

export default TourCard;
