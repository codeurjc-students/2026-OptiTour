import { Container, Form, InputGroup, Row, Col } from 'react-bootstrap';
import TourCard from '../../components/tour-card/tour-card';
import ImageCarousel from '../../components/image-carousel/image-carousel';
import './index.css';
import type { TourDTO } from '../../dto/tour-dto';
import { useEffect, useState } from 'react';
import { getAllTours } from '../../service/tour-service';
import Spinner from '../../components/spinner/spinner';
import ErrorCard from '../../components/error-card/error-card';

function Index() {
  const [tours, setTours] = useState<TourDTO[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGetTours() {
    try {
      setLoading(true);
      const response = await getAllTours();
      setTours(response);
    }
    catch (error) {
      setError('No se han podido cargar los datos desde el servidor. Inténtalo de nuevo más tarde.');
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => { handleGetTours() }, []);

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

      {loading && <Spinner />}

      {error ? <ErrorCard text={error} /> :
        <Row className="ot-index__grid" xs={1} sm={2} md={4}>
          {tours?.map((tour) => (
            <Col key={tour.id} className="ot-index__grid-item">
              <TourCard title={tour.name} desc={tour.description} to="/tourdetail" />
            </Col>
          ))}
        </Row>
      }

    </Container>
  );
}
export default Index;