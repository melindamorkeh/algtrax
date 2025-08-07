'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAlgorithmById } from '@/data/algorithms';
import { AlgorithmService } from '@/utils/algorithmService';
import { GraphRenderer } from './GraphRenderer';
import { HashTableRenderer } from './HashTableRenderer';

/**
 * Visualizer Component Props
 * 
 * Defines the interface for the visualizer component that displays
 * algorithm animations and provides playback controls.
 */
interface VisualiserProps {
    states: any[];           // Array of visualization states from the algorithm
    algorithmId?: string;    // Current algorithm identifier
}

/**
 * Bar Data Interface
 * 
 * Represents individual bars in bar chart visualizations
 * (used for sorting and array-based algorithms).
 */
interface BarData {
    value: number;           // Numeric value of the bar
    index: number;           // Position in the array
    status: 'normal' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'searching' | 'found';  // Visual state
}

/**
 * Node Interface
 * 
 * Represents vertices in graph visualizations
 * (used for graph traversal and pathfinding algorithms).
 */
interface Node {
    id: string;              // Unique node identifier
    x: number;               // X coordinate for positioning
    y: number;               // Y coordinate for positioning
    value?: number;          // Optional numeric value
    status: 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end';  // Visual state
}

/**
 * Edge Interface
 * 
 * Represents connections between nodes in graph visualizations.
 */
interface Edge {
    from: string;            // Source node ID
    to: string;              // Target node ID
    weight?: number;         // Optional edge weight
    status: 'normal' | 'visited' | 'path' | 'current';  // Visual state
}

/**
 * Graph Data Interface
 * 
 * Complete graph structure for graph-based algorithm visualizations.
 */
interface GraphData {
    nodes: Node[];           // Array of graph nodes
    edges: Edge[];           // Array of graph edges
    directed: boolean;       // Whether the graph is directed
    weighted: boolean;       // Whether edges have weights
}

/**
 * Algorithm Visualizer Component
 * 
 * This is the main visualization component that displays algorithm animations.
 * It supports three types of visualizations:
 * - Bar charts for sorting and array-based algorithms
 * - Graph visualizations for graph traversal algorithms
 * - Hash table visualizations for hash table operations
 * 
 * The component provides playback controls and automatically determines
 * the appropriate visualization type based on the algorithm category.
 */
export function Visualiser({ states, algorithmId }: VisualiserProps) {
    // Animation state management
    const [currentState, setCurrentState] = useState(0);        // Current animation frame
    const [isPlaying, setIsPlaying] = useState(false);          // Play/pause state
    const [speed, setSpeed] = useState(1000);                   // Animation speed in milliseconds
    const [visualizationType, setVisualizationType] = useState<'bars' | 'graph' | 'hash'>('bars');  // Visualization type
    
    // Data state for different visualization types
    const [graphData, setGraphData] = useState<GraphData>({
        nodes: [],
        edges: [],
        directed: false,
        weighted: false
    });
    const [barData, setBarData] = useState<BarData[]>([]);
    
    // Animation interval reference for cleanup
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Get algorithm metadata for display purposes
    const algorithm = algorithmId ? getAlgorithmById(algorithmId) : null;

    /**
     * Determine Visualization Type
     * 
     * Automatically selects the appropriate visualization type based on
     * the algorithm category. This ensures the correct visual representation
     * is used for each algorithm type.
     */
    useEffect(() => {
        if (algorithm) {
            if (algorithm.category === 'Sorting') {
                setVisualizationType('bars');
            } else if (algorithm.category === 'Searching') {
                if (algorithm.id === 'hash-table-search') {
                    setVisualizationType('hash');
                } else {
                    setVisualizationType('bars');
                }
            } else {
                setVisualizationType('graph');
            }
        }
    }, [algorithm]);

    /**
     * Initialize Bar Chart Data
     * 
     * Sets up the initial bar chart data for sorting and array-based algorithms.
     * This creates the visual representation of the array as bars.
     */
    const initializeBarData = () => {
        const initialValues = [64, 34, 25, 12, 22, 11, 90, 45, 78, 33];
        const bars: BarData[] = initialValues.map((value, index) => ({
            value,
            index,
            status: 'normal'
        }));
        setBarData(bars);
    };

    /**
     * Initialize Graph Data
     * 
     * Sets up the initial graph structure for graph-based algorithms.
     * This creates the visual representation of nodes and edges.
     */
    const initializeGraphData = () => {
        // Create a sample graph with nodes and edges
        const nodes: Node[] = [
            { id: 'A', x: 100, y: 100, status: 'unvisited' },
            { id: 'B', x: 200, y: 150, status: 'unvisited' },
            { id: 'C', x: 300, y: 100, status: 'unvisited' },
            { id: 'D', x: 150, y: 200, status: 'unvisited' },
            { id: 'E', x: 250, y: 200, status: 'unvisited' },
            { id: 'F', x: 350, y: 150, status: 'unvisited' },
        ];

        const edges: Edge[] = [
            { from: 'A', to: 'B', weight: 4, status: 'normal' },
            { from: 'A', to: 'D', weight: 2, status: 'normal' },
            { from: 'B', to: 'C', weight: 3, status: 'normal' },
            { from: 'B', to: 'E', weight: 5, status: 'normal' },
            { from: 'C', to: 'F', weight: 1, status: 'normal' },
            { from: 'D', to: 'E', weight: 6, status: 'normal' },
            { from: 'E', to: 'F', weight: 2, status: 'normal' },
        ];

        setGraphData({ nodes, edges, directed: false, weighted: true });
    };

    /**
     * Animation Control Effect
     * 
     * Manages the automatic playback of the algorithm animation.
     * Advances through states at the specified speed when playing.
     */
    useEffect(() => {
        if (isPlaying && states.length > 0) {
            intervalRef.current = setInterval(() => {
                setCurrentState(prev => {
                    if (prev >= states.length - 1) {
                        setIsPlaying(false); // Stop when animation completes
                        return prev;
                    }
                    return prev + 1;
                });
            }, speed);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Cleanup interval on unmount or dependency change
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, states.length, speed]);

    /**
     * Play Animation
     * 
     * Starts the automatic playback of the algorithm animation.
     */
    const playAnimation = () => {
        if (states.length > 0) {
            setIsPlaying(true);
            setCurrentState(0);
        }
    };

    /**
     * Pause Animation
     * 
     * Stops the automatic playback while maintaining current position.
     */
    const pauseAnimation = () => {
        setIsPlaying(false);
    };

    /**
     * Reset Animation
     * 
     * Returns the animation to the beginning and stops playback.
     */
    const resetAnimation = () => {
        setIsPlaying(false);
        setCurrentState(0);
    };

    /**
     * Next Step
     * 
     * Manually advances to the next frame of the animation.
     */
    const nextStep = () => {
        if (currentState < states.length - 1) {
            setCurrentState(prev => prev + 1);
        }
    };

    /**
     * Previous Step
     * 
     * Manually returns to the previous frame of the animation.
     */
    const prevStep = () => {
        if (currentState > 0) {
            setCurrentState(prev => prev - 1);
        }
    };

    /**
     * Render Bar Chart Visualization
     * 
     * Creates the bar chart visualization for sorting and array-based algorithms.
     * Each bar represents an array element, and colors indicate the current operation.
     */
    const renderBars = () => {
        // Get current state data from the algorithm
        const currentStateData = states[currentState];
        if (!currentStateData) {
            return (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No visualization data available</p>
                </div>
            );
        }

        // Extract visualization data from current state
        const values = currentStateData.values || barData.map(bar => bar.value);
        const comparing = currentStateData.comparing || [];
        const swapping = currentStateData.swapping || [];
        const sorted = currentStateData.sorted || [];
        const key = currentStateData.key;
        const left = currentStateData.left || [];
        const right = currentStateData.right || [];
        const merging = currentStateData.merging || false;
        const pivot = currentStateData.pivot || [];
        const partition = currentStateData.partition || [];
        const searching = currentStateData.searching || [];
        const found = currentStateData.found || [];
        const target = currentStateData.target;

        // Calculate visualization dimensions
        const maxValue = Math.max(...values);
        const containerHeight = 300;

        return (
            <div className="w-full h-full flex flex-col">
                {/* Bar Chart Display */}
                <div className="flex-1 flex items-end justify-center space-x-2 p-4">
                    {values.map((value: number, index: number) => {
                        // Determine bar color based on current operation
                        let status = 'normal';
                        if (comparing.includes(index)) status = 'comparing';
                        else if (swapping.includes(index)) status = 'swapping';
                        else if (sorted.includes(index)) status = 'sorted';
                        else if (key === index) status = 'pivot';
                        else if (left.includes(index)) status = 'left';
                        else if (right.includes(index)) status = 'right';
                        else if (pivot.includes(index)) status = 'pivot';
                        else if (partition.includes(index)) status = 'partition';
                        else if (searching.includes(index)) status = 'searching';
                        else if (found.includes(index)) status = 'found';

                        return (
                            <motion.div
                                key={index}
                                className={`w-8 rounded-t-lg transition-all duration-300 ${
                                    status === 'comparing' ? 'bg-yellow-400' :
                                    status === 'swapping' ? 'bg-red-400' :
                                    status === 'sorted' ? 'bg-green-400' :
                                    status === 'pivot' ? 'bg-purple-400' :
                                    status === 'searching' ? 'bg-blue-400' :
                                    status === 'found' ? 'bg-green-500' :
                                    status === 'left' ? 'bg-blue-300' :
                                    status === 'right' ? 'bg-purple-300' :
                                    status === 'partition' ? 'bg-orange-300' :
                                    status === 'searching' ? 'bg-blue-400' :
                                    status === 'found' ? 'bg-green-500' :
                                    'bg-gray-400'
                                }`}
                                style={{
                                    height: `${(value / maxValue) * containerHeight}px`,
                                    minHeight: '20px'
                                }}
                                initial={{ scale: 1 }}
                                animate={{
                                    scale: status === 'comparing' || status === 'swapping' ? 1.1 : 1
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-xs text-center text-white font-medium mt-1">
                                    {value}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                
                {/* Progress Information */}
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    {currentState < states.length ? `Step ${currentState + 1} of ${states.length}` : 'Animation complete'}
                    {target !== undefined && (
                        <div className="mt-2 text-sm">
                            <span className="font-medium">Target:</span> {target}
                        </div>
                    )}
                </div>
                
                {/* Legend for Algorithm-Specific Colors */}
                {(merging || pivot.length > 0 || searching.length > 0) && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                        {merging && (
                            <>
                                <span className="inline-block w-3 h-3 bg-blue-300 rounded mr-1"></span>
                                Left subarray
                                <span className="inline-block w-3 h-3 bg-purple-300 rounded ml-3 mr-1"></span>
                                Right subarray
                                <span className="inline-block w-3 h-3 bg-yellow-400 rounded ml-3 mr-1"></span>
                                Comparing
                                <span className="inline-block w-3 h-3 bg-green-400 rounded ml-3 mr-1"></span>
                                Merged
                            </>
                        )}
                        {pivot.length > 0 && (
                            <>
                                <span className="inline-block w-3 h-3 bg-purple-400 rounded mr-1"></span>
                                Pivot
                                <span className="inline-block w-3 h-3 bg-orange-300 rounded ml-3 mr-1"></span>
                                Partition
                                <span className="inline-block w-3 h-3 bg-yellow-400 rounded ml-3 mr-1"></span>
                                Comparing
                                <span className="inline-block w-3 h-3 bg-red-400 rounded ml-3 mr-1"></span>
                                Swapping
                            </>
                        )}
                        {searching.length > 0 && (
                            <>
                                <span className="inline-block w-3 h-3 bg-blue-400 rounded mr-1"></span>
                                Searching
                                <span className="inline-block w-3 h-3 bg-green-500 rounded ml-3 mr-1"></span>
                                Found
                                <span className="inline-block w-3 h-3 bg-yellow-400 rounded ml-3 mr-1"></span>
                                Comparing
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    /**
     * Render Graph Visualization
     * 
     * Creates the graph visualization for graph-based algorithms.
     * Uses the GraphRenderer component to display nodes and edges.
     */
    const renderGraph = () => {
        const currentStateData = states[currentState];
        if (!currentStateData) {
            return (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No visualization data available</p>
                </div>
            );
        }

        const { nodes, edges } = currentStateData;

        return (
            <div className="w-full h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <GraphRenderer nodes={nodes} edges={edges} width={600} height={400} />
                </div>
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    {currentState < states.length ? `Step ${currentState + 1} of ${states.length}` : 'Animation complete'}
                </div>
            </div>
        );
    };

    /**
     * Render Hash Table Visualization
     * 
     * Creates the hash table visualization for hash table operations.
     * Uses the HashTableRenderer component to display buckets and chains.
     */
    const renderHashTable = () => {
        const currentStateData = states[currentState];
        if (!currentStateData) {
            return (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No visualization data available</p>
                </div>
            );
        }

        const { 
            buckets, 
            searchKey, 
            currentBucket, 
            currentNode, 
            found, 
            searchPath, 
            hashValue 
        } = currentStateData;

        return (
            <div className="w-full h-full">
                <HashTableRenderer
                    buckets={buckets}
                    searchKey={searchKey}
                    currentBucket={currentBucket}
                    currentNode={currentNode}
                    found={found}
                    searchPath={searchPath}
                    hashValue={hashValue}
                />
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    {currentState < states.length ? `Step ${currentState + 1} of ${states.length}` : 'Animation complete'}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Playback Controls */}
            <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={resetAnimation}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={prevStep}
                        disabled={currentState === 0}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <button
                        onClick={isPlaying ? pauseAnimation : playAnimation}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button
                        onClick={nextStep}
                        disabled={currentState >= states.length - 1}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
                
                {/* Speed Control */}
                <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Speed:</label>
                    <input
                        type="range"
                        min="100"
                        max="2000"
                        step="100"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-24"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{speed}ms</span>
                </div>
            </div>

            {/* Visualization Display */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4">
                {visualizationType === 'bars' ? renderBars() : 
                 visualizationType === 'graph' ? renderGraph() : 
                 renderHashTable()}
            </div>

            {/* Algorithm Information */}
            {algorithm && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {algorithm.name} Visualization
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {visualizationType === 'bars' 
                            ? 'Watch the bars as they are compared and swapped during the sorting process.'
                            : 'Observe how the algorithm explores the graph, highlighting visited nodes and the path taken.'
                        }
                    </p>
                </div>
            )}
        </div>
    );
} 