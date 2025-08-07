/**
 * Controls Component
 * 
 * This component provides the main control interface for algorithm execution
 * and visualization playback. It includes:
 * - Run button to execute user code
 * - Playback controls for algorithm visualization
 * - Speed adjustment for animation playback
 * - Integration with the global state store
 * 
 * The controls coordinate between the code editor and visualizer components,
 * allowing users to run their code and watch the resulting visualizations.
 */

import { useStore } from '../../store';

interface ControlsProps {
    onRun: () => void;
}

export function Controls({ onRun }: ControlsProps) {
    return (
        <div className="flex items-center space-x-4">
            {/* Run Button - Executes the user's code and generates visualizations */}
            <button
                onClick={onRun}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
                Run Algorithm
            </button>
        </div>
    );
} 