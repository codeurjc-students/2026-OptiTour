import type { ReactNode } from 'react';
import './user-list-item.css';

interface UserListItemProps {
    userName: string;
    avatarSrc?: string;
    actions?: ReactNode;
}

function UserListItem({ userName, avatarSrc, actions }: UserListItemProps) {
    return (
        <div className="ot-user-item">
            <div className="ot-user-item__avatar">
                {avatarSrc ? (
                    <img src={avatarSrc} alt={userName} />
                ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="9" r="3.5" />
                        <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
                    </svg>
                )}
            </div>
            <span className="ot-user-item__name">{userName}</span>
            {actions && <div className="ot-user-item__actions">{actions}</div>}
        </div>
    );
}

export default UserListItem;