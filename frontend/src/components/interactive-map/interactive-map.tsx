import './interactive-map.css';

interface InteractiveMapProps {
    bbox?: [number, number, number, number];
    className?: string;
    coords?: string
}


function InteractiveMap({ bbox, className = '', coords }: InteractiveMapProps) {
    // If there are no coords, we set to default Madrid coords
    let finalBbox = bbox || [-3.7458, 40.4045, -3.6693, 40.4351];
    let markerParam = '';

    if (coords) {
        const parts = coords.split(',');
        if (parts.length === 2) {
            const lat = Number(parts[0]);
            const lon = Number(parts[1]);

            // Check if these are actually numbers
            if (!isNaN(lat) && !isNaN(lon)) {
                markerParam = `&marker=${lat}%2C${lon}`;

                // If there are coords but not bbox, we calculate it (with 0.005 by default)
                if (!bbox) {
                    finalBbox = [lon - 0.005, lat - 0.005, lon + 0.005, lat + 0.005];
                }
            }
        }
    }

    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${finalBbox.join('%2C')}&layer=mapnik${markerParam}`;

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
