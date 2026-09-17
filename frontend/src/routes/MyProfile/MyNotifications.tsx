import { Button } from 'react-bootstrap';
import NotificationItem from '../../components/NotificationItem/NotificationItem';

function NotificationsPage() {
    return (
        <div>
            <h1 className="ot-panel-title">Notificaciones</h1>

            <NotificationItem
                variant="user"
                message="Nueva solicitud de amistad de <<Usuario>>"
                actions={
                    <>
                        <Button className="ot-notification__accept">Aceptar</Button>
                        <Button variant="outline-dark">Ignorar</Button>
                    </>
                }
            />

            <NotificationItem
                variant="group"
                message="Nueva invitación de grupo: <<Nombre del grupo>>"
                actions={
                    <>
                        <Button className="ot-notification__accept">Aceptar</Button>
                        <Button variant="outline-dark">Ignorar</Button>
                    </>
                }
            />

            <NotificationItem
                variant="tour"
                message="Tu grupo <<Nombre del grupo>> te ha incluido en un nuevo tour privado"
                actions={<Button variant="outline-dark">Ver detalle del tour</Button>}
            />
        </div>
    );
}

export default NotificationsPage;