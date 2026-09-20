import type { ReactNode } from 'react';
import './group-list-item.css';

interface GroupListItemProps {
    name: string;
    action?: ReactNode;
}

function GroupListItem({ name, action }: GroupListItemProps) {
    return (
        <div className="ot-group-item">
            <span className="ot-group-item__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="8" r="3" />
                    <path d="M2 20c0-3 3-5 7-5s7 2 7 5" />
                    <circle cx="17" cy="9" r="2.5" />
                    <path d="M15.5 13.2c2.8.4 4.5 2.1 4.5 4.3" />
                </svg>
            </span>
            <span className="ot-group-item__name">{name}</span>
            {action && <div className="ot-group-item__action">{action}</div>}
        </div>
    );
}

export default GroupListItem;