import { Container, Form, InputGroup, Row, Col, Button } from 'react-bootstrap';
import TourCard from '../../components/tour-card/tour-card';
import ImageCarousel from '../../components/image-carousel/image-carousel';
import './index.css';
import type { TourDTO } from '../../dto/tour-dto';
import { useEffect, useState } from 'react';
import { getToursByPage } from '../../service/tour-service';
import Spinner from '../../components/spinner/spinner';
import ErrorCard from '../../components/error-card/error-card';

function Index() {
  const [tours, setTours] = useState<TourDTO[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loadMoreUsed, setLoadMoreUsed] = useState<boolean>(false);

  async function handleGetTours(page: number, size: number, isUseEffect: boolean) {
    try {
      if (isUseEffect)
        setLoading(true);
      else
        setLoadingMore(true);

      const response = await getToursByPage(page, size);

      setTours([...(tours || []), ...response.content])

      const { number, totalPages } = response.page;
      setIsLastPage(number + 1 >= totalPages);

      const nextPage = page + 1;
      setCurrentPage(nextPage);
    }
    catch (error) {
      if (isUseEffect)
        setError('No se han podido cargar los datos desde el servidor. Inténtalo de nuevo más tarde.');
      else
        setLoadMoreError('No se han podido cargar más resultados. Inténtalo de nuevo más tarde.')
    }
    finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  async function handleLoadMoreButton() {
    if (!loadMoreUsed) {
      await handleGetTours(2, 4, false);
      setLoadMoreUsed(true);
    }
    else
      await handleGetTours(currentPage, 4, false);
  }

  useEffect(() => { handleGetTours(0, 8, true) }, []);

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

      <h2 className="text-center mt-5 mb-4 fw-bold" style={{ color: 'var(--ot-text)' }}>
        Explora nuestros tours destacados
      </h2>

      {loading && <Spinner />}

      {error ? <ErrorCard text={error} /> :
        <>
          <Row className="ot-index__grid justify-content-center" xs={1} sm={2} md={4}>
            {tours?.map((tour, index) => (
              <Col
                key={tour.id}
                className="ot-index__grid-item ot-index__grid-item-animate"
                style={{ animationDelay: `${(index % 4) * 0.2}s` }}
              >
                <TourCard title={tour.name} desc={tour.description} to="/tourdetail" />
              </Col>
            ))}
          </Row>
          {loadingMore && <Spinner />}
          {loadMoreError && <ErrorCard text={loadMoreError} />}
          {!loadingMore && tours && tours.length > 0 && !isLastPage && !loadMoreError && (
            <div className="text-center mt-5 mb-4">
              <Button
                variant="outline-success"
                className="ot-tour-card__btn d-inline-flex align-items-center justify-content-center load-more-button"
                style={{ gap: '0.5rem' }}
                onClick={handleLoadMoreButton}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                </svg>
                Cargar más
              </Button>
            </div>
          )}
        </>
      }

    </Container>
  );
}
export default Index;