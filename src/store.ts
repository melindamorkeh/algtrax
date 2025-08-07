import { create } from 'zustand';
import { AlgorithmService } from './utils/algorithmService';

/**
 * Global Application State Interface
 * 
 * Defines the structure for the application's global state that's shared
 * between components like the code editor, visualizer, and controls.
 */
interface Store {
    code: string;                    // Current code in the editor
    states: any[];                   // Visualization states for the current algorithm
    currentAlgorithm: string | null; // Currently selected algorithm ID
    runAlgorithm: (code: string) => void;           // Execute user's code
    setCode: (code: string) => void;                // Update editor code
    setAlgorithm: (algorithmId: string) => void;    // Change selected algorithm
    generateStates: (algorithmId: string) => void;  // Generate visualization states
}

/**
 * Global State Store
 * 
 * Uses Zustand for lightweight state management. This store coordinates:
 * - Code editor state and user input
 * - Algorithm visualization states
 * - Algorithm selection and switching
 * - Communication between different UI components
 */
export const useStore = create<Store>((set, get) => ({
    // Initial state
    code: '',
    states: [],
    currentAlgorithm: null,
    
    /**
     * Run Algorithm Function
     * 
     * Executes the user's code and generates visualization states.
     * Currently a placeholder - would integrate with a code execution engine.
     */
    runAlgorithm: (code) => {
        // TODO: Implement algorithm running logic
        // This would:
        // 1. Parse and validate the user's code
        // 2. Execute it with sample data
        // 3. Generate visualization states from the execution
        // 4. Update the states array for the visualizer
        set({ states: [] });
    },
    
    /**
     * Set Code Function
     * 
     * Updates the code editor content. Called whenever the user
     * types or modifies code in the editor.
     */
    setCode: (code) => set({ code }),
    
    /**
     * Set Algorithm Function
     * 
     * Changes the currently selected algorithm. This triggers
     * state regeneration and UI updates.
     */
    setAlgorithm: (algorithmId) => set({ currentAlgorithm: algorithmId }),
    
    /**
     * Generate States Function
     * 
     * Creates visualization states for a specific algorithm.
     * This is the core function that powers the visualization system.
     * 
     * Different algorithms require different visualization types:
     * - Sorting algorithms: Bar chart visualizations
     * - Graph algorithms: Node/edge visualizations  
     * - Hash table: Special hash table visualization
     */
    generateStates: (algorithmId) => {
        const { currentAlgorithm } = get();
        
        // Avoid regenerating states if algorithm hasn't changed
        if (algorithmId === currentAlgorithm) return;

        let states: any[] = [];
        
        // Determine algorithm type and generate appropriate states
        // This routing logic determines what visualization type to use
        if (['bubble-sort', 'insertion-sort', 'merge-sort', 'quick-sort', 'linear-search', 'hash-table-search'].includes(algorithmId)) {
          // Sorting and array-based algorithms use bar chart visualization
          const defaultData = AlgorithmService.getDefaultSortingData();
          states = AlgorithmService.generateSortingStates(algorithmId, defaultData);
        } else if (['breadth-first-search', 'depth-first-search', 'dijkstra', 'a-star'].includes(algorithmId)) {
            // Graph algorithms use node/edge visualization
            const { nodes, edges } = AlgorithmService.getDefaultGraphData();
            states = AlgorithmService.generateGraphStates(algorithmId, nodes, edges, 'A', 'F');
        }
        
        // Update the global state with new visualization states
        set({ states, currentAlgorithm: algorithmId });
    },
})); 