import { Container, Form, InputGroup, Row, Col } from 'react-bootstrap';
import TourCard from '../../components/TourCard/TourCard';
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';
import './Index.css';

interface TourSummary {
  id: number;
  title: string;
}

const tours: TourSummary[] = [
  { id: 1, title: 'Tour público 1' },
  { id: 2, title: 'Tour público 2' },
  { id: 3, title: 'Tour público 3' },
  { id: 4, title: 'Tour público 4' },
];

function Index() {
  return (
    <Container className="ot-index">
      <Form className="ot-index__search">
        <InputGroup>
          <InputGroup.Text className="ot-index__search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </InputGroup.Text>
          <Form.Control placeholder="Escribe aquí para buscar" aria-label="Buscar tours" />
        </InputGroup>
      </Form>

      <div className="ot-index__carousel">
        <ImageCarousel
          slides={[
            { eyebrow: 'Carrusel de imágenes', title: 'Tours destacados', variant: 'primary' },
            { eyebrow: 'Carrusel de imágenes', title: 'Descubre nuevas rutas', variant: 'dark' },
          ]}
        />
      </div>

      <Row className="ot-index__grid" xs={1} sm={2} md={4}>
        {tours.map((tour) => (
          <Col key={tour.id} className="ot-index__grid-item">
            <TourCard title={tour.title} to="/tourdetail" />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Index;