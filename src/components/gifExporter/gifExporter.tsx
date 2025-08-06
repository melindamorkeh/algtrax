interface GifExporterProps {
    frames: any[]; // TODO: Define proper type for frames
}

export function GifExporter({ frames }: GifExporterProps) {
    return (
        <div className="controls-container">
            <button 
                onClick={() => {/* TODO: Implement GIF export */}}
                className="button button-secondary"
            >
                Export as GIF
            </button>
        </div>
    );
} 