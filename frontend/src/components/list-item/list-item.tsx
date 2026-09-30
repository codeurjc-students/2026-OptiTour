import type { ReactNode } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './list-item.css';

interface ListItemProps {
    title: string;
    desc?: string;
    imageSrc?: string;
    to?: string;

    actionLabel?: string;

    actions?: ReactNode;

    layout?: 'inline' | 'stacked';
    size?: 'sm' | 'md';
}


function ListItem({
    title,
    desc,
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

    const className = `ot-list-item ot-list-item--${size} ot-list-item--${layout} ${desc ? 'ot-list-item--with-desc' : ''}`;

    const content = (
        <div className="ot-list-item__content">
            <span className="ot-list-item__title">{title}</span>
            {desc && <span className="ot-list-item__desc">{desc}</span>}
        </div>
    );

    if (!resolvedActions) {
        return (
            <Link to={to} className={`${className} ot-list-item--link`}>
                {thumb}
                {content}
            </Link>
        );
    }

    if (layout === 'stacked') {
        return (
            <div className={className}>
                <div className="ot-list-item__head">
                    {thumb}
                    {content}
                </div>
                <div className="ot-list-item__actions">{resolvedActions}</div>
            </div>
        );
    }

    return (
        <div className={className}>
            {thumb}
            {content}
            <div className="ot-list-item__actions">{resolvedActions}</div>
        </div>
    );
}

export default ListItem;
