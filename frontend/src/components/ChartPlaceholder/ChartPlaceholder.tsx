import './ChartPlaceholer.css';

interface ChartPlaceholderProps {
    type: 'pie' | 'bar' | 'line';
    label: string;
}

const icons = {
    pie: (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v10l8.5 5A10 10 0 0 0 12 2Z" fill="currentColor" opacity="0.15" />
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v10l8.5 5" />
        </svg>
    ),
    bar: (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 20V10M10 20V4M16 20v-7M20 20H4" />
        </svg>
    ),
    line: (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 17 9 11l4 3 7-8" />
            <path d="M4 20h16" />
        </svg>
    ),
};

function ChartPlaceholder({ type, label }: ChartPlaceholderProps) {
    return (
        <div className="ot-chart-placeholder">
            <span className="ot-chart-placeholder__icon">{icons[type]}</span>
            <span className="ot-chart-placeholder__label">{label}</span>
        </div>
    );
}

export default ChartPlaceholder;