import { useEffect, useState } from "react";
import Profile from "../../components/profile/profile";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../../service/user-service";
import type { UserDTO } from "../../dto/user-dto";
import Spinner from "../../components/spinner/spinner";
import ErrorCard from "../../components/error-card/error-card";
import useDocumentTitle from "../../hooks/use-document-title";

export function meta() {
    return [
        { title: "Perfil de Usuario | OptiTour" },
    ];
}

export default function UserProfile() {
    const { id } = useParams();
    const [user, setUser] = useState<UserDTO>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useDocumentTitle(
        error
            ? "Error | OptiTour"
            : user?.username
                ? `${user.username} - Perfil de Usuario | OptiTour`
                : "Perfil de Usuario | OptiTour"
    );

    async function handleGetUser(userId: number) {
        try {
            const response = await getUserById(userId);
            setUser(response);
        } catch (err) {
            setError("Se ha producido un error al obtener los datos del usuario.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            handleGetUser(parseInt(id));
        }
    }, [id]);

    if (error) {
        return <ErrorCard text={error} />;
    }

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : user ? (
                <div className="ot-my-profile">
                    <h1 className="ot-panel-title text-center">Perfil de usuario</h1>
                    <Profile user={user} />
                    <div className="ot-my-profile__actions">
                        <Link to="/admin/users" className="btn btn-outline-dark">
                            Volver a la lista de usuarios
                        </Link>
                    </div>
                </div>
            ) : null}
        </>
    );
}
