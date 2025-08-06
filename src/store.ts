import { create } from 'zustand';
import { AlgorithmService } from './utils/algorithmService';

interface Store {
    code: string;
    states: any[];
    currentAlgorithm: string | null;
    runAlgorithm: (code: string) => void;
    setCode: (code: string) => void;
    setAlgorithm: (algorithmId: string) => void;
    generateStates: (algorithmId: string) => void;
}

export const useStore = create<Store>((set, get) => ({
    code: '',
    states: [],
    currentAlgorithm: null,
    runAlgorithm: (code) => {
        // TODO: Implement algorithm running logic
        set({ states: [] });
    },
    setCode: (code) => set({ code }),
    setAlgorithm: (algorithmId) => set({ currentAlgorithm: algorithmId }),
    generateStates: (algorithmId) => {
        const { currentAlgorithm } = get();
        
        if (algorithmId === currentAlgorithm) return;

        let states: any[] = [];
        
                // Determine algorithm type and generate appropriate states
        if (['bubble-sort', 'insertion-sort', 'merge-sort', 'quick-sort', 'linear-search', 'hash-table-search'].includes(algorithmId)) {
          const defaultData = AlgorithmService.getDefaultSortingData();
          states = AlgorithmService.generateSortingStates(algorithmId, defaultData);
        } else if (['breadth-first-search', 'depth-first-search', 'dijkstra', 'a-star'].includes(algorithmId)) {
            const { nodes, edges } = AlgorithmService.getDefaultGraphData();
            states = AlgorithmService.generateGraphStates(algorithmId, nodes, edges, 'A', 'F');
        }
        
        set({ states, currentAlgorithm: algorithmId });
    },
})); 