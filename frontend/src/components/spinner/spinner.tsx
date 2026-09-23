import './spinner.css';

interface SpinnerProps {
    size?: number;
    label?: string;
}

function Spinner({ size = 40, label }: SpinnerProps) {
    return (
        <div className="ot-spinner-wrap">
            <span
                className="ot-spinner"
                style={{ width: size, height: size }}
                role="status"
                aria-label={label ?? 'Cargando'}
            />
            {label && <span className="ot-spinner-wrap__label">{label}</span>}
        </div>
    );
}

export default Spinner;