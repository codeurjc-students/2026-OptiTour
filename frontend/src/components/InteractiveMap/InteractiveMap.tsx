import './InteractiveMap.css';

interface InteractiveMapProps {

    bbox?: [number, number, number, number];
    className?: string;
}


function InteractiveMap({
    bbox = [-3.7458, 40.4045, -3.6693, 40.4351],
    className = '',
}: InteractiveMapProps) {
    const src =
        'https://www.openstreetmap.org/export/embed.html' +
        `?bbox=${bbox.join('%2C')}&layer=mapnik`;

    return (
        <div className={`ot-map ${className}`}>
            <iframe
                className="ot-map__frame"
                src={src}
                title="Mapa interactivo de la ruta"
                loading="lazy"
            />
            <small className="ot-map__attribution">
                ©{' '}
                <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
                    Colaboradores de OpenStreetMap
                </a>
            </small>
        </div>
    );
}

export default InteractiveMap;