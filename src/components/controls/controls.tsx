interface ControlsProps {
    onRun: () => void;
}

export function Controls({ onRun }: ControlsProps) {
    return (
        <div className="controls-container">
            <button 
                onClick={onRun}
                className="button button-primary"
            >
                Run Algorithm
            </button>
        </div>
    );
} 