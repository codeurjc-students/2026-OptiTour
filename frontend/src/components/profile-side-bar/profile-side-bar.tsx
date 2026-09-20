import type { ReactNode } from 'react';
import { NavLink, Link } from 'react-router';
import './profile-side-bar.css';

export interface SidebarItem {
    label: string;
    to: string;
    icon?: ReactNode;
    className?: string;
}

interface ProfileSidebarProps {
    userName: string;
    avatarSrc?: string;
    items: SidebarItem[];
    profileTo?: string;
    /** Ej. "Cuenta de administrador" — se muestra encima del nombre. */
    roleLabel?: string;
}

function ProfileSidebar({
    userName,
    avatarSrc,
    items,
    profileTo = '/profile',
    roleLabel,
}: ProfileSidebarProps) {
    return (
        <aside className="ot-sidebar">
            <div className="ot-sidebar__user">
                <div className="ot-sidebar__avatar">
                    {avatarSrc ? (
                        <img src={avatarSrc} alt={userName} />
                    ) : (
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="9" r="3.5" />
                            <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
                        </svg>
                    )}
                </div>
                {roleLabel && <span className="ot-sidebar__role">{roleLabel}</span>}
                <span className="ot-sidebar__username">{userName}</span>
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