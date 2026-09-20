import type { ReactNode } from 'react';
import './notification-item.css';

interface NotificationItemProps {
    message: string;
    variant: 'user' | 'group' | 'tour';
    actions?: ReactNode;
}

const icons = {
    user: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="9" r="3.5" />
            <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
        </svg>
    ),
    group: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="8" r="3" />
            <path d="M2 20c0-3 3-5 7-5s7 2 7 5" />
            <circle cx="17" cy="9" r="2.5" />
            <path d="M15.5 13.2c2.8.4 4.5 2.1 4.5 4.3" />
        </svg>
    ),
    tour: <span className="ot-notification__img-label">Img</span>,
};

function NotificationItem({ message, variant, actions }: NotificationItemProps) {
    return (
        <div className="ot-notification">
            <div className={`ot-notification__icon ot-notification__icon--${variant}`}>
                {icons[variant]}
            </div>
            <div className="ot-notification__body">
                <p className="ot-notification__message">{message}</p>
                {actions && <div className="ot-notification__actions">{actions}</div>}
            </div>
        </div>
    );
}

export default NotificationItem;