/**
 * Algorithm Service
 * 
 * This service is responsible for generating visualization states for different algorithms.
 * It acts as a bridge between the algorithm implementations and the visualization system,
 * providing the data structures needed to render algorithm animations.
 */

import { bubbleSort } from '../algorithms/bubble-sort';
import { insertionSort } from '../algorithms/insertion-sort';
import { mergeSort } from '../algorithms/merge-sort';
import { quickSort } from '../algorithms/quick-sort';
import { linearSearch } from '../algorithms/linear-search';
import { hashTableSearch } from '../algorithms/hash-table-search';
import { binarySearch } from '../algorithms/binary-search';

import { breadthFirstSearch } from '../algorithms/bfs';
import { depthFirstSearch } from '../algorithms/dfs';
import { tricolorAlgorithm } from '../algorithms/tricolor-algorithm';

import { dijkstra } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/a-star';

/**
 * Algorithm State Interface
 * 
 * Defines the structure for visualization states that are passed to the visualizer.
 * Different algorithm types produce different state structures.
 */
export interface AlgorithmState {
  type: 'sorting' | 'graph';  // Determines which visualizer component to use
  data: any;                  // Algorithm-specific state data
}

/**
 * Algorithm Service Class
 * 
 * Provides methods to generate visualization states for different algorithm types.
 * Each method takes algorithm-specific parameters and returns an array of states
 * that represent the algorithm's execution step by step.
 */
export class AlgorithmService {
  
  /**
   * Generate Sorting States
   * 
   * Creates visualization states for sorting and array-based algorithms.
   * These algorithms use bar chart visualizations where each bar represents
   * an array element and colors indicate the current operation.
   * 
   * @param algorithmId - The algorithm to generate states for
   * @param values - The input array to sort
   * @returns Array of visualization states showing each step of the algorithm
   */
  static generateSortingStates(algorithmId: string, values: number[]): any[] {
    switch (algorithmId) {
      case 'bubble-sort':
        return bubbleSort(values);
      case 'insertion-sort':
        return insertionSort(values);
      case 'merge-sort':
        return mergeSort(values);
      case 'quick-sort':
        return quickSort(values);
      case 'linear-search':
        // For search algorithms, use middle element as target
        const target = values[Math.floor(values.length / 2)];
        return linearSearch(values, target);
      case 'binary-search':
        // Binary search requires sorted array
        const sortedValues = [...values].sort((a, b) => a - b);
        const binaryTarget = sortedValues[Math.floor(sortedValues.length / 2)];
        return binarySearch(sortedValues, binaryTarget);
      case 'hash-table-search':
        // Hash table uses string keys and numeric values
        const keys = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape'];
        const searchKey = 'cherry';
        return hashTableSearch(keys, values.slice(0, keys.length), searchKey);
      default:
        return [];
    }
  }

  /**
   * Generate Graph States
   * 
   * Creates visualization states for graph-based algorithms.
   * These algorithms use node/edge visualizations where nodes represent
   * vertices and edges represent connections between them.
   * 
   * @param algorithmId - The algorithm to generate states for
   * @param nodes - Array of graph nodes with positions and status
   * @param edges - Array of graph edges with weights and status
   * @param startNode - Starting node for traversal/pathfinding
   * @param endNode - Optional end node for pathfinding algorithms
   * @returns Array of visualization states showing each step of the algorithm
   */
  static generateGraphStates(algorithmId: string, nodes: any[], edges: any[], startNode: string, endNode?: string): any[] {
    switch (algorithmId) {
      case 'breadth-first-search':
        return breadthFirstSearch(nodes, edges, startNode, endNode);
      case 'depth-first-search':
        return depthFirstSearch(nodes, edges, startNode, endNode);
      case 'tricolor-algorithm':
        return tricolorAlgorithm(nodes, edges, startNode, endNode);
      case 'dijkstra':
        return dijkstra(nodes, edges, startNode, endNode);
      case 'a-star':
        return aStar(nodes, edges, startNode, endNode || 'F');
      default:
        return [];
    }
  }

  /**
   * Get Default Sorting Data
   * 
   * Provides a standard array of numbers for sorting algorithm demonstrations.
   * This ensures consistent, interesting visualizations across different
   * sorting algorithms.
   * 
   * @returns Array of numbers to be sorted
   */
  static getDefaultSortingData(): number[] {
    return [64, 34, 25, 12, 22, 11, 90, 45, 78, 33];
  }

  /**
   * Get Default Graph Data
   * 
   * Provides a standard graph structure for graph algorithm demonstrations.
   * The graph is designed to show interesting traversal patterns and
   * pathfinding scenarios.
   * 
   * @returns Object containing nodes and edges for the demonstration graph
   */
  static getDefaultGraphData(): { nodes: any[], edges: any[] } {
    // Define nodes with positions for visualization - larger graph for better space utilization
    const nodes = [
      { id: 'A', x: 50, y: 50, status: 'unvisited' },
      { id: 'B', x: 150, y: 50, status: 'unvisited' },
      { id: 'C', x: 250, y: 50, status: 'unvisited' },
      { id: 'D', x: 350, y: 50, status: 'unvisited' },
      { id: 'E', x: 100, y: 150, status: 'unvisited' },
      { id: 'F', x: 200, y: 150, status: 'unvisited' },
      { id: 'G', x: 300, y: 150, status: 'unvisited' },
      { id: 'H', x: 50, y: 250, status: 'unvisited' },
      { id: 'I', x: 150, y: 250, status: 'unvisited' },
      { id: 'J', x: 250, y: 250, status: 'unvisited' },
      { id: 'K', x: 350, y: 250, status: 'unvisited' },
    ];

    // Define edges with weights for weighted algorithms - more connections for interesting paths
    const edges = [
      { from: 'A', to: 'B', weight: 4, status: 'normal' },
      { from: 'A', to: 'E', weight: 2, status: 'normal' },
      { from: 'B', to: 'C', weight: 3, status: 'normal' },
      { from: 'B', to: 'F', weight: 5, status: 'normal' },
      { from: 'C', to: 'D', weight: 1, status: 'normal' },
      { from: 'C', to: 'G', weight: 2, status: 'normal' },
      { from: 'D', to: 'G', weight: 3, status: 'normal' },
      { from: 'E', to: 'F', weight: 6, status: 'normal' },
      { from: 'E', to: 'H', weight: 4, status: 'normal' },
      { from: 'F', to: 'G', weight: 2, status: 'normal' },
      { from: 'F', to: 'I', weight: 3, status: 'normal' },
      { from: 'G', to: 'J', weight: 5, status: 'normal' },
      { from: 'H', to: 'I', weight: 2, status: 'normal' },
      { from: 'I', to: 'J', weight: 4, status: 'normal' },
      { from: 'J', to: 'K', weight: 1, status: 'normal' },
    ];

    return { nodes, edges };
  }
} 