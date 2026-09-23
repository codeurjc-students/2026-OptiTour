import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';
import PanelSearch from '../../components/panel-search/panel-search';
import ListItem from '../../components/list-item/list-item';

interface AdminTour {
    id: number;
    title: string;
}

const tours: AdminTour[] = [
    { id: 1, title: '<<Nombre de tour 1>>' },
    { id: 2, title: '<<Nombre de tour 2>>' },
    { id: 3, title: '<<Nombre de tour 3>>' },
    { id: 4, title: '<<Nombre de tour 4>>' },
    { id: 5, title: '<<Nombre de tour 5>>' },
];

function GestionToursPage() {
    const navigate = useNavigate();
    return (
        <div>
            <div className="ot-panel-header">
                <h1 className="ot-panel-title">Gestión de tours</h1>
                <Link to="/route-builder" className="btn ot-panel-action ot-panel-action--inline text-decoration-none">
                    Crear tour público
                </Link>
            </div>

            <PanelSearch placeholder="Busca tours por nombre" />

            {tours.map((tour) => (
                <ListItem
                    key={tour.id}
                    title={tour.title}
                    actions={
                        <>
                            <Button variant="outline-success" onClick={() => navigate(`/admin/tours/${tour.id}/editar`)}>
                                Editar
                            </Button>
                            <Button variant="outline-danger">Eliminar</Button>
                        </>
                    }
                />
            ))}
        </div>
    );
}

export default GestionToursPage;