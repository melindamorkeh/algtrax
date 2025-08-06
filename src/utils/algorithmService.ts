import { bubbleSort } from '../algorithms/bubble-sort';
import { insertionSort } from '../algorithms/insertion-sort';
import { mergeSort } from '../algorithms/merge-sort';
import { quickSort } from '../algorithms/quick-sort';
import { linearSearch } from '../algorithms/linear-search';
import { hashTableSearch } from '../algorithms/hash-table-search';

import { breadthFirstSearch } from '../algorithms/bfs';
import { depthFirstSearch } from '../algorithms/dfs';

import { dijkstra } from '../algorithms/dijkstra';

export interface AlgorithmState {
  type: 'sorting' | 'graph';
  data: any;
}

export class AlgorithmService {
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
        const target = values[Math.floor(values.length / 2)]; // Use middle element as target
        return linearSearch(values, target);
      case 'hash-table-search':
        const keys = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape'];
        const searchKey = 'cherry';
        return hashTableSearch(keys, values.slice(0, keys.length), searchKey);
      default:
        return [];
    }
  }

  static generateGraphStates(algorithmId: string, nodes: any[], edges: any[], startNode: string, endNode?: string): any[] {
    switch (algorithmId) {
      case 'breadth-first-search':
        return breadthFirstSearch(nodes, edges, startNode, endNode);
      case 'depth-first-search':
        return depthFirstSearch(nodes, edges, startNode, endNode);
      case 'dijkstra':
        return dijkstra(nodes, edges, startNode, endNode);
      default:
        return [];
    }
  }

  static getDefaultSortingData(): number[] {
    return [64, 34, 25, 12, 22, 11, 90, 45, 78, 33];
  }

  static getDefaultGraphData(): { nodes: any[], edges: any[] } {
    const nodes = [
      { id: 'A', x: 100, y: 100, status: 'unvisited' },
      { id: 'B', x: 200, y: 150, status: 'unvisited' },
      { id: 'C', x: 300, y: 100, status: 'unvisited' },
      { id: 'D', x: 150, y: 200, status: 'unvisited' },
      { id: 'E', x: 250, y: 200, status: 'unvisited' },
      { id: 'F', x: 350, y: 150, status: 'unvisited' },
    ];

    const edges = [
      { from: 'A', to: 'B', weight: 4, status: 'normal' },
      { from: 'A', to: 'D', weight: 2, status: 'normal' },
      { from: 'B', to: 'C', weight: 3, status: 'normal' },
      { from: 'B', to: 'E', weight: 5, status: 'normal' },
      { from: 'C', to: 'F', weight: 1, status: 'normal' },
      { from: 'D', to: 'E', weight: 6, status: 'normal' },
      { from: 'E', to: 'F', weight: 2, status: 'normal' },
    ];

    return { nodes, edges };
  }
} 