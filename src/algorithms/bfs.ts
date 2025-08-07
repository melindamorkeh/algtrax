/**
 * Breadth-First Search Algorithm Implementation
 * 
 * This file contains the BFS algorithm that generates visualization states
 * for the graph visualizer. Each step shows the current node being visited,
 * the queue of nodes to visit, and the path taken through the graph.
 */

/**
 * Node Interface
 * 
 * Represents a vertex in the graph with position and status information
 * for visualization purposes.
 */
export interface Node {
  id: string;                                    // Unique node identifier
  x: number;                                     // X coordinate for visualization
  y: number;                                     // Y coordinate for visualization
  status: 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end';  // Visual status
}

/**
 * Edge Interface
 * 
 * Represents a connection between two nodes with optional weight
 * and status for visualization.
 */
export interface Edge {
  from: string;                                  // Source node ID
  to: string;                                    // Target node ID
  weight?: number;                               // Edge weight (for weighted graphs)
  status: 'normal' | 'visited' | 'path' | 'current';  // Visual status
}

/**
 * Graph State Interface
 * 
 * Defines the structure for each visualization state in the BFS animation.
 * Each state represents a snapshot of the graph traversal at a specific point.
 */
export interface GraphState {
  nodes: Node[];         // Current state of all nodes
  edges: Edge[];         // Current state of all edges
  queue: string[];       // Current queue of nodes to visit
  visited: string[];     // Array of visited node IDs
  current: string | null; // Currently processing node ID
}

/**
 * Breadth-First Search Algorithm
 * 
 * Implements BFS and generates visualization states for each step of the traversal.
 * BFS explores all vertices at the present depth before moving to vertices
 * at the next depth level, making it useful for finding shortest paths
 * in unweighted graphs.
 * 
 * @param nodes - Array of graph nodes
 * @param edges - Array of graph edges
 * @param startNode - Starting node for the traversal
 * @param endNode - Optional target node for pathfinding
 * @returns Array of visualization states showing each step of the algorithm
 */
export function breadthFirstSearch(
  nodes: Node[],
  edges: Edge[],
  startNode: string,
  endNode?: string
): GraphState[] {
  const states: GraphState[] = [];
  const queue: string[] = [startNode];           // Queue of nodes to visit
  const visited: Set<string> = new Set();       // Set of visited nodes
  const parent: Map<string, string> = new Map(); // For reconstructing paths

  // Initialize first state - shows the starting configuration
  const initialNodes = nodes.map(node => ({
    ...node,
    status: (node.id === startNode ? 'start' : 'unvisited') as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end'
  }));

  states.push({
    nodes: initialNodes,
    edges: edges.map(edge => ({ ...edge, status: 'normal' })),
    queue: [...queue],
    visited: [],
    current: null
  });

  // Main BFS loop - process nodes in breadth-first order
  while (queue.length > 0) {
    const current = queue.shift()!; // Dequeue the next node to process
    
    // Skip if already visited (shouldn't happen in standard BFS, but safety check)
    if (visited.has(current)) continue;
    
    visited.add(current);

    // State: Show the current node being processed
    // This creates the visual effect of highlighting the current node
    const updatedNodes = states[states.length - 1].nodes.map(node => ({
      ...node,
      status: (node.id === current ? 'current' : 
              visited.has(node.id) ? 'visited' : node.status) as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end'
    }));

    states.push({
      nodes: updatedNodes,
      edges: states[states.length - 1].edges,
      queue: [...queue],
      visited: Array.from(visited),
      current
    });

    // Find all neighbors of the current node
    const neighbors = edges
      .filter(edge => edge.from === current || edge.to === current)
      .map(edge => edge.from === current ? edge.to : edge.from);

    // Process each neighbor
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor) && !queue.includes(neighbor)) {
        queue.push(neighbor); // Add unvisited neighbor to queue
        parent.set(neighbor, current); // Track parent for path reconstruction

        // State: Show the edge being explored
        // This creates the visual effect of highlighting the current edge
        const updatedEdges = states[states.length - 1].edges.map(edge => ({
          ...edge,
          status: ((edge.from === current && edge.to === neighbor) ||
                  (edge.to === current && edge.from === neighbor) ? 'current' : edge.status) as 'normal' | 'visited' | 'path' | 'current'
        }));

        states.push({
          nodes: updatedNodes,
          edges: updatedEdges,
          queue: [...queue],
          visited: Array.from(visited),
          current
        });
      }
    }

    // If we found the end node, reconstruct and highlight the path
    if (endNode && current === endNode) {
      const path = reconstructPath(parent, startNode, endNode);
      
      // Get the current edges state
      const currentEdges = states[states.length - 1].edges;
      
      // State: Highlight the shortest path found
      // This shows the complete path from start to end node
      const finalNodes = updatedNodes.map(node => ({
        ...node,
        status: (path.includes(node.id) ? 'path' : node.status) as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end'
      }));

      const finalEdges = currentEdges.map(edge => ({
        ...edge,
        status: (path.includes(edge.from) && path.includes(edge.to) ? 'path' : edge.status) as 'normal' | 'visited' | 'path' | 'current'
      }));

      states.push({
        nodes: finalNodes,
        edges: finalEdges,
        queue: [...queue],
        visited: Array.from(visited),
        current
      });
      
      break; // Exit early since we found the target
    }
  }

  return states;
}

/**
 * Reconstruct Path
 * 
 * Helper function to reconstruct the shortest path from start to end node
 * using the parent map built during BFS traversal.
 * 
 * @param parent - Map of child nodes to their parent nodes
 * @param start - Starting node ID
 * @param end - Ending node ID
 * @returns Array of node IDs representing the path from start to end
 */
function reconstructPath(parent: Map<string, string>, start: string, end: string): string[] {
  const path: string[] = [];
  let current = end;
  
  // Work backwards from end to start using parent pointers
  while (current !== start) {
    path.unshift(current);
    current = parent.get(current) || start;
  }
  
  path.unshift(start);
  return path;
}
