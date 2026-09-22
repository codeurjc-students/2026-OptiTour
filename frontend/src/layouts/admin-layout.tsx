import { Outlet } from 'react-router';
import ProfileSidebar, { type SidebarItem } from '../components/profile-side-bar/profile-side-bar';
import './profile-layout.css';
import { useAuthStore } from '../store/auth-store';

const usersIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="9" cy="8" r="3" />
        <path d="M2 20c0-3 3-5 7-5s7 2 7 5" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M15.5 13c2.6.5 4.5 2.1 4.5 4" />
    </svg>
);

const poiIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.3" />
    </svg>
);

const billingIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
    </svg>
);

const bellIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
);

const profileIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
);

const toursIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
);

const adminMenu: SidebarItem[] = [
    { label: 'Gestión de usuarios', to: '/admin/users', icon: usersIcon },
    { label: 'Gestión de tours', to: '/admin/tours', icon: toursIcon },
    { label: 'Gestión de puntos de interés', to: '/admin/poi', icon: poiIcon, className: 'ot-sidebar__link--sm' },
    { label: 'Facturación', to: '/admin/billing', icon: billingIcon },
    { label: 'Notificaciones', to: '/admin/notifications', icon: bellIcon },
];

function AdminLayout() {
    const { loggedUser } = useAuthStore();

    if (!loggedUser) {
        return null;
    }

    return (
        <div className="ot-profile-layout">
            <ProfileSidebar
                userName="Nombre de usuario"
                items={adminMenu}
                roleLabel="Cuenta de administrador"
                profileTo="/admin/profile"
            />
            <main className="ot-profile-layout__content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;