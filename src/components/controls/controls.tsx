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
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

interface ControlsProps {
    onRun: () => void;
}

export function Controls({ onRun }: ControlsProps) {
    return (
        <div className="flex items-center space-x-4">
            {/* Run Button - Executes the user's code and generates visualizations */}
            <SignedIn>
                <button
                    onClick={onRun}
                    className="btn-base btn-success text-xs sm:text-sm whitespace-nowrap overflow-hidden"
                >
                    <span className="block truncate">Run Algorithm</span>
                </button>
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="btn-base btn-success text-xs sm:text-sm whitespace-nowrap overflow-hidden">
                        <span className="block truncate">Run Algorithm</span>
                    </button>
                </SignInButton>
            </SignedOut>
        </div>
    );
} 