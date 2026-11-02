import type { UserDTO } from "../../dto/user-dto";
import ProfileImage from "../profile-image/profile-image";
import "./profile.css";

export interface profileProps {
    user: UserDTO;
}

export default function Profile({ user }: profileProps) {
    return (
        <>
            <ProfileImage userId={user.id} />
            <h2 className="ot-my-profile__name">{user!.userName}</h2>
            <dl className="ot-my-profile__data">
                <div>
                    <dt>Correo electrónico</dt>
                    <dd>{user!.email}</dd>
                </div>
                <div>
                    {user!.phoneNumber && (
                        <>
                            <dt>Número de teléfono</dt>
                            <dd>{user!.phoneNumber}</dd>
                        </>
                    )}
                </div>
                <div>
                    <dt>Se unió el día</dt>
                    <dd>{
                        user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })
                            : 'Desconocido'
                    }
                    </dd>
                </div>
            </dl>
        </>
    );
}
