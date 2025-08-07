/**
 * Algorithm Data Structure and Configuration
 * 
 * This file contains all the algorithm definitions used throughout the application.
 * Each algorithm has metadata that determines how it's displayed, what features
 * are available, and how it's categorized for the user interface.
 */

/**
 * Algorithm Interface
 * 
 * Defines the structure for algorithm metadata that's displayed to users
 * and used by the visualization system to determine rendering behavior.
 */
export interface Algorithm {
  id: string;                    // Unique identifier used in URLs and routing
  name: string;                  // Display name shown to users
  category: string;              // Category for grouping algorithms (Sorting, Searching, etc.)
  image: string;                 // Path to algorithm image (currently unused)
  hasCode: boolean;              // Whether code editor functionality is available
  hasQuiz: boolean;              // Whether quiz functionality is available (future feature)
  description: string;           // User-friendly description of the algorithm
  complexity: {
    time: string;                // Time complexity notation (e.g., "O(n²)")
    space: string;               // Space complexity notation (e.g., "O(1)")
  };
}

/**
 * Algorithm Database
 * 
 * Contains all available algorithms organized by category.
 * Each algorithm entry determines:
 * - How it appears in the landing page algorithm cards
 * - What visualization type is used (bars, graph, hash table)
 * - What code templates are available in the editor
 * - What complexity information is displayed
 */
export const algorithms: Algorithm[] = [
  // Sorting Algorithms
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "Sorting",
    image: "/bubble-sort.jpg",
    hasCode: true,
    hasQuiz: true,
    description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    complexity: {
      time: "O(n²)",
      space: "O(1)"
    }
  },
  {
    id: "insertion-sort",
    name: "Insertion Sort",
    category: "Sorting",
    image: "/insertion-sort.jpg",
    hasCode: true,
    hasQuiz: true,
    description: "Builds the final sorted array one item at a time by repeatedly inserting a new element into the sorted portion of the array.",
    complexity: {
      time: "O(n²)",
      space: "O(1)"
    }
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    category: "Sorting",
    image: "/merge-sort.jpg",
    hasCode: true,
    hasQuiz: true,
    description: "A divide-and-conquer algorithm that recursively breaks down a problem into two or more sub-problems until they become simple enough to solve directly.",
    complexity: {
      time: "O(n log n)",
      space: "O(n)"
    }
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    category: "Sorting",
    image: "/quick-sort.jpg",
    hasCode: true,
    hasQuiz: true,
    description: "A highly efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy with a pivot element to partition the array.",
    complexity: {
      time: "O(n log n) average, O(n²) worst",
      space: "O(log n)"
    }
  },
  
  // Searching Algorithms
  {
    id: "binary-search",
    name: "Binary Search",
    category: "Searching",
    image: "/binary-search.jpg",
    hasCode: true,
    hasQuiz: true,
    description: "A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.",
    complexity: {
      time: "O(log n)",
      space: "O(1)"
    }
  },
  {
    id: "hash-table-search",
    name: "Hash Table Search",
    category: "Searching",
    image: "/hash-table-search.jpg",
    hasCode: true,
    hasQuiz: true,
    description: "A data structure that implements an associative array abstract data type using linked lists for collision resolution.",
    complexity: {
      time: "O(1) average, O(n) worst",
      space: "O(n)"
    }
  },
  {
    id: "linear-search",
    name: "Linear Search",
    category: "Searching",
    image: "/linear-search.jpg",
    hasCode: true,
    hasQuiz: true,
    description: "A method for finding a target value within a list by checking each element in sequence until the target is found.",
    complexity: {
      time: "O(n)",
      space: "O(1)"
    }
  },
  
  // Graph Traversal Algorithms
  {
    id: "breadth-first-search",
    name: "Breadth First Search",
    category: "Graph Traversal",
    image: "/bfs.jpg",
    hasCode: true,
    hasQuiz: true,
    description: "An algorithm for traversing or searching tree or graph data structures, exploring all vertices at the present depth before moving on to vertices at the next depth level.",
    complexity: {
      time: "O(V + E)",
      space: "O(V)"
    }
  },
  {
    id: "depth-first-search",
    name: "Depth First Search",
    category: "Graph Traversal",
    image: "/dfs.jpg",
    hasCode: true,
    hasQuiz: true,
    description: "An algorithm for traversing or searching tree or graph data structures, exploring as far as possible along each branch before backtracking.",
    complexity: {
      time: "O(V + E)",
      space: "O(V)"
    }
  },
  {
    id: "tricolor-algorithm",
    name: "Tricolor Algorithm",
    category: "Graph Traversal",
    image: "/tricolor.jpg",
    hasCode: true,
    hasQuiz: true,
    description: "A graph traversal algorithm that uses three colors to mark the state of vertices during traversal.",
    complexity: {
      time: "O(V + E)",
      space: "O(V)"
    }
  },
  
  // Path Finding Algorithms
  {
    id: "dijkstra",
    name: "Dijkstra",
    category: "Path Finding",
    image: "/dijkstra.jpg",
    hasCode: true,
    hasQuiz: true,
    description: "An algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks.",
    complexity: {
      time: "O(V²)",
      space: "O(V)"
    }
  },
  {
    id: "a-star",
    name: "A*",
    category: "Path Finding",
    image: "/a-star.jpg",
    hasCode: true,
    hasQuiz: true,
    description: "A pathfinding algorithm that uses a heuristic function to estimate the cost to reach the goal, making it more efficient than Dijkstra's algorithm.",
    complexity: {
      time: "O(V log V)",
      space: "O(V)"
    }
  }
];

/**
 * Algorithm Categories
 * 
 * Used to group algorithms on the landing page and determine
 * the order in which categories are displayed.
 */
export const categories = ["Sorting", "Searching", "Graph Traversal", "Path Finding"];

/**
 * Utility Functions
 * 
 * Helper functions for finding and filtering algorithms
 */

/**
 * Find an algorithm by its unique identifier
 * Used for URL routing and algorithm selection
 */
export const getAlgorithmById = (id: string): Algorithm | undefined => {
  return algorithms.find(algo => algo.id === id);
};

/**
 * Get all algorithms in a specific category
 * Used for filtering and displaying algorithms by category
 */
export const getAlgorithmsByCategory = (category: string): Algorithm[] => {
  return algorithms.filter(algo => algo.category === category);
}; 