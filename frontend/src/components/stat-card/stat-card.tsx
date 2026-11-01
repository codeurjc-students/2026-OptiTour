import './stat-card.css';

interface StatCardProps {
    value: string;
    label: string;
    className?: string;
}

function StatCard({ value, label, className }: StatCardProps) {
    return (
        <div className={`ot-stat-card ${className ?? ''}`.trim()}>
            <span className="ot-stat-card__value">{value}</span>
            <span className="ot-stat-card__label">{label}</span>
        </div>
    );
}

export default StatCard;
