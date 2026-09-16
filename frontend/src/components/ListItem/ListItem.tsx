import type { ReactNode } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import './ListItem.css';

interface ListItemProps {
    title: string;
    imageSrc?: string;
    to?: string;

    actionLabel?: string;

    actions?: ReactNode;

    layout?: 'inline' | 'stacked';
    size?: 'sm' | 'md';
}


function ListItem({
    title,
    imageSrc,
    to = '#',
    actionLabel,
    actions,
    layout = 'inline',
    size = 'md',
}: ListItemProps) {
    const resolvedActions =
        actions ??
        (actionLabel ? (
            <Button href={to} variant="outline-success" className="ot-list-item__btn">
                {actionLabel}
            </Button>
        ) : null);

    const thumb = (
        <div className="ot-list-item__thumb">
            {imageSrc ? <img src={imageSrc} alt={title} /> : <span>Img</span>}
        </div>
    );

    const className = `ot-list-item ot-list-item--${size} ot-list-item--${layout}`;


    if (!resolvedActions) {
        return (
            <Link to={to} className={`${className} ot-list-item--link`}>
                {thumb}
                <span className="ot-list-item__title">{title}</span>
            </Link>
        );
    }

    if (layout === 'stacked') {
        return (
            <div className={className}>
                <div className="ot-list-item__head">
                    {thumb}
                    <span className="ot-list-item__title">{title}</span>
                </div>
                <div className="ot-list-item__actions">{resolvedActions}</div>
            </div>
        );
    }

    return (
        <div className={className}>
            {thumb}
            <span className="ot-list-item__title">{title}</span>
            <div className="ot-list-item__actions">{resolvedActions}</div>
        </div>
    );
}

export default ListItem;