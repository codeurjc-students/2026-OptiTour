interface ErrorCardProps {
    text: string
}

import './error-card.css';

export default function ErrorCard({ text }: ErrorCardProps) {
    return (
        <div className="ot-error-card">{text}</div>
    );
}