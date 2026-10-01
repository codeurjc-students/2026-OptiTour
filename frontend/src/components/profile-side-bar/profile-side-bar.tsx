import type { ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './profile-side-bar.css';
import ProfileImage from '../profile-image/profile-image';
import { useAuthStore } from '../../store/auth-store';

export interface SidebarItem {
    label: string;
    to: string;
    icon?: ReactNode;
    className?: string;
}

interface ProfileSidebarProps {
    items: SidebarItem[];
    profileTo?: string;
}

function ProfileSidebar({
    items,
    profileTo = '/profile',
}: ProfileSidebarProps) {
    const { loggedUser } = useAuthStore();
    const roleLabel = loggedUser?.roles?.includes('ADMIN') ? 'Cuenta de administrador' : undefined;

    return (
        <aside className="ot-sidebar">
            <div className="ot-sidebar__user">
                <ProfileImage className="ot-sidebar__avatar" />
                {roleLabel && <span className="ot-sidebar__role">{roleLabel}</span>}
                <span className="ot-sidebar__username">{loggedUser?.userName}</span>
                <Link to={profileTo} className="btn btn-outline-dark ot-sidebar__profile-btn">
                    Ver mi perfil
                </Link>
            </div>

            <nav className="ot-sidebar__nav">
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `ot-sidebar__link${isActive ? ' ot-sidebar__link--active' : ''}${item.className ? ' ' + item.className : ''}`
                        }
                    >
                        {item.icon && <span className="ot-sidebar__link-icon">{item.icon}</span>}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="ot-sidebar__nav ot-sidebar__nav--footer">
                <Link to="/" className="ot-sidebar__link ot-sidebar__home-btn">
                    <span className="ot-sidebar__link-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
                            <polyline points="9 21 9 12 15 12 15 21" />
                        </svg>
                    </span>
                    Volver al la página principal
                </Link>
            </div>
        </aside>
    );
}

export default ProfileSidebar;
