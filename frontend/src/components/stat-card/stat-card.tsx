import './stat-card.css';

interface StatCardProps {
    value: string;
    label: string;
}

function StatCard({ value, label }: StatCardProps) {
    return (
        <div className="ot-stat-card">
            <span className="ot-stat-card__value">{value}</span>
            <span className="ot-stat-card__label">{label}</span>
        </div>
    );
}

export default StatCard;