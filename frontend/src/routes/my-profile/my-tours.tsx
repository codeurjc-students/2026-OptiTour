import { Button } from 'react-bootstrap';
import PanelSearch from '../../components/panel-search/panel-search';
import ListItem from '../../components/list-item/list-item';

const tours = [
    { id: 1, title: '<<Nombre de tour 1>>' },
    { id: 2, title: '<<Nombre de tour 2>>' },
    { id: 3, title: '<<Nombre de tour 3>>' },
    { id: 4, title: '<<Nombre de tour 4>>' },
    { id: 5, title: '<<Nombre de tour 5>>' },
];

function MyTours() {
    return (
        <div>
            <div className="ot-panel-header">
                <h1 className="ot-panel-title">Lista de tours</h1>
                <Button className="ot-panel-action ot-panel-action--inline">Crear tour privado</Button>
            </div>

            <PanelSearch placeholder="Busca tours por nombre" />

            {tours.map((tour) => (
                <ListItem
                    key={tour.id}
                    title={tour.title}
                    to={`/tourdetail`}
                    actionLabel="Ver detalle"
                />
            ))}
        </div>
    );
}

export default MyTours;