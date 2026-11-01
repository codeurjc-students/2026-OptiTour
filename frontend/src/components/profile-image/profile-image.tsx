import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth-store";
import { API_BASE_URL } from "../../service/api-config";

const base_url = API_BASE_URL;

interface ProfileImageProps {
    className?: string;
    userId?: number;
}

export default function ProfileImage({ className = "ot-my-profile__avatar", userId }: ProfileImageProps) {
    const [imageError, setImageError] = useState(false);
    const { imageVersion } = useAuthStore();

    useEffect(() => {
        setImageError(false);
    }, [userId, imageVersion]);

    return (
        <div className={className}>
            {userId && !imageError ? (
                <img
                    src={`${base_url}/user/${userId}/image?v=${imageVersion}`}
                    alt="Avatar del perfil"
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    onError={() => setImageError(true)}
                />
            ) : (
                <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="9" r="3.5" />
                    <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
                </svg>
            )}
        </div>
    );
}
