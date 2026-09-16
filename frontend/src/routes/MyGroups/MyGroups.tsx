import { Button } from 'react-bootstrap';
import PanelSearch from '../../components/PanelSearch/PanelSearch';
import GroupListItem from '../../components/GroupListItem/GroupListItem';

const groups = [
    '<<Nombre de grupo 1>>',
    '<<Nombre de grupo 2>>',
    '<<Nombre de grupo 3>>',
    '<<Nombre de grupo 4>>',
    '<<Nombre de grupo 5>>',
];

function MyGroups() {
    return (
        <div>
            <h1 className="ot-panel-title">Mis grupos</h1>
            <PanelSearch placeholder="Buscar por nombre de grupo" />

            <Button className="ot-panel-action">Crear grupo</Button>

            {groups.map((name) => (
                <GroupListItem
                    key={name}
                    name={name}
                    action={<Button variant="outline-dark">Ver grupo</Button>}
                />
            ))}
        </div>
    );
}

export default MyGroups;