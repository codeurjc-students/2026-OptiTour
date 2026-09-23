import { Button } from 'react-bootstrap';
import PanelSearch from '../../components/panel-search/panel-search';
import UserListItem from '../../components/user-list-item/user-list-item';

const friends = [
    '<<Nombre de usuario 1>>',
    '<<Nombre de usuario 2>>',
    '<<Nombre de usuario 3>>',
    '<<Nombre de usuario 4>>',
    '<<Nombre de usuario 5>>',
];

function MyFriends() {
    return (
        <div>
            <h1 className="ot-panel-title">Lista de amigos</h1>
            <PanelSearch placeholder="Buscar amigos por nombre" />

            {friends.map((name) => (
                <UserListItem
                    key={name}
                    userName={name}
                    actions={
                        <>
                            <Button variant="outline-danger">Eliminar</Button>
                            <Button variant="outline-dark">Ver perfil</Button>
                        </>
                    }
                />
            ))}
        </div>
    );
}

export default MyFriends;