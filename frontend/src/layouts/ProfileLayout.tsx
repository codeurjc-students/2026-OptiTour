import { Outlet } from 'react-router';
import ProfileSidebar, { type SidebarItem } from '../components/ProfileSideBar/ProfileSideBar';
import './ProfileLayout.css';

const friendsIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const groupsIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        <path d="M8 7v10" />
    </svg>
);

const toursIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
        <path d="M12 8v4l3 3" />
    </svg>
);

const paymentsIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const bellIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
);

const userMenu: SidebarItem[] = [
    { label: 'Lista de amigos', to: '/profile/friends', icon: friendsIcon },
    { label: 'Mis grupos',      to: '/profile/groups',  icon: groupsIcon },
    { label: 'Mis tours',       to: '/profile/tours',   icon: toursIcon },
    { label: 'Mis pagos',       to: '/profile/payments', icon: paymentsIcon },
    { label: 'Notificaciones',  to: '/profile/notifications', icon: bellIcon },
];

function ProfileLayout() {
    return (
        <div className="ot-profile-layout">
            <ProfileSidebar
                userName="Nombre de usuario"
                items={userMenu}
            />
            <main className="ot-profile-layout__content">
                <Outlet />
            </main>
        </div>
    );
}

export default ProfileLayout;