/**
 * Tricolor Algorithm Implementation
 * 
 * This file contains the tricolor algorithm (also known as the three-color marking algorithm)
 * that generates visualization states for the graph visualizer. This algorithm is commonly
 * used in garbage collection and graph traversal, where nodes are marked with three colors:
 * white (unvisited), gray (being processed), and black (completed).
 */

/**
 * Node Interface
 * 
 * Represents a vertex in the graph with position, color, and status information
 * for visualization purposes.
 */
export interface Node {
  id: string;                                    // Unique node identifier
  x: number;                                     // X coordinate for visualization
  y: number;                                     // Y coordinate for visualization
  status: 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end' | 'white' | 'gray' | 'black';  // Visual status
  color: 'white' | 'gray' | 'black';            // Tricolor marking
}

/**
 * Edge Interface
 * 
 * Represents a connection between two nodes with status for visualization.
 */
export interface Edge {
  from: string;                                  // Source node ID
  to: string;                                    // Target node ID
  weight?: number;                               // Edge weight (optional)
  status: 'normal' | 'visited' | 'path' | 'current';  // Visual status
}

/**
 * Graph State Interface
 * 
 * Defines the structure for each visualization state in the tricolor algorithm animation.
 * Each state represents a snapshot of the graph traversal at a specific point.
 */
export interface GraphState {
  nodes: Node[];         // Current state of all nodes
  edges: Edge[];         // Current state of all edges
  whiteNodes: string[];  // Nodes that are white (unvisited)
  grayNodes: string[];   // Nodes that are gray (being processed)
  blackNodes: string[];  // Nodes that are black (completed)
  current: string | null; // Currently processing node ID
  stack: string[];       // Stack for DFS-like processing
  path?: string[];       // Path found from start to end (optional)
}

/**
 * Tricolor Algorithm
 * 
 * Implements the tricolor marking algorithm and generates visualization states
 * for each step of the process. This algorithm is used for graph traversal
 * where nodes are marked with three colors to track their processing state.
 * 
 * The algorithm works by:
 * 1. Initially all nodes are white (unvisited)
 * 2. When a node is discovered, it becomes gray (being processed)
 * 3. When a node is fully processed, it becomes black (completed)
 * 
 * @param nodes - Array of graph nodes
 * @param edges - Array of graph edges
 * @param startNode - Starting node for the traversal
 * @param endNode - Optional target node for pathfinding
 * @returns Array of visualization states showing each step of the algorithm
 */
export function tricolorAlgorithm(
  nodes: Node[],
  edges: Edge[],
  startNode: string,
  endNode?: string
): GraphState[] {
  const states: GraphState[] = [];
  const whiteNodes: Set<string> = new Set(nodes.map(n => n.id));
  const grayNodes: Set<string> = new Set();
  const blackNodes: Set<string> = new Set();
  const stack: string[] = [startNode];
  const parent: Map<string, string> = new Map();

  // Initialize first state - shows all nodes as white
  const initialNodes = nodes.map(node => ({
    ...node,
    status: (node.id === startNode ? 'start' : 
             node.id === endNode ? 'end' : 'white') as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end' | 'white' | 'gray' | 'black',
    color: 'white' as 'white' | 'gray' | 'black'
  }));

  states.push({
    nodes: initialNodes,
    edges: edges.map(edge => ({ ...edge, status: 'normal' })),
    whiteNodes: Array.from(whiteNodes),
    grayNodes: [],
    blackNodes: [],
    current: null,
    stack: [...stack]
  });

  // Main tricolor algorithm loop
  while (stack.length > 0) {
    const current = stack[stack.length - 1]; // Peek at top of stack

    // Skip if already processed
    if (blackNodes.has(current)) {
      stack.pop();
      continue;
    }

    // If node is white, mark it as gray and add to gray set
    if (whiteNodes.has(current)) {
      whiteNodes.delete(current);
      grayNodes.add(current);

      // State: Show node becoming gray
      const updatedNodes = states[states.length - 1].nodes.map(node => ({
        ...node,
        status: (node.id === current ? 'gray' : 
                node.id === startNode ? 'start' :
                node.id === endNode ? 'end' :
                grayNodes.has(node.id) ? 'gray' :
                blackNodes.has(node.id) ? 'black' : 'white') as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end' | 'white' | 'gray' | 'black',
        color: (grayNodes.has(node.id) ? 'gray' : 
                blackNodes.has(node.id) ? 'black' : 'white') as 'white' | 'gray' | 'black'
      }));

      states.push({
        nodes: updatedNodes,
        edges: states[states.length - 1].edges,
        whiteNodes: Array.from(whiteNodes),
        grayNodes: Array.from(grayNodes),
        blackNodes: Array.from(blackNodes),
        current,
        stack: [...stack]
      });
    }

    // Find unvisited neighbors
    const neighbors = edges
      .filter(edge => edge.from === current || edge.to === current)
      .map(edge => edge.from === current ? edge.to : edge.from)
      .filter(neighbor => whiteNodes.has(neighbor));

    if (neighbors.length > 0) {
      // Add first unvisited neighbor to stack
      const nextNeighbor = neighbors[0];
      stack.push(nextNeighbor);
      parent.set(nextNeighbor, current);

      // State: Show edge being explored
      const updatedEdges = states[states.length - 1].edges.map(edge => ({
        ...edge,
        status: ((edge.from === current && edge.to === nextNeighbor) ||
                (edge.to === current && edge.from === nextNeighbor) ? 'current' : edge.status) as 'normal' | 'visited' | 'path' | 'current'
      }));

      states.push({
        nodes: states[states.length - 1].nodes,
        edges: updatedEdges,
        whiteNodes: Array.from(whiteNodes),
        grayNodes: Array.from(grayNodes),
        blackNodes: Array.from(blackNodes),
        current,
        stack: [...stack]
      });
    } else {
      // No unvisited neighbors, mark current node as black
      grayNodes.delete(current);
      blackNodes.add(current);
      stack.pop();

      // State: Show node becoming black
      const updatedNodes = states[states.length - 1].nodes.map(node => ({
        ...node,
        status: (node.id === current ? 'black' : 
                node.id === startNode ? 'start' :
                node.id === endNode ? 'end' :
                grayNodes.has(node.id) ? 'gray' :
                blackNodes.has(node.id) ? 'black' : 'white') as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end' | 'white' | 'gray' | 'black',
        color: (grayNodes.has(node.id) ? 'gray' : 
                blackNodes.has(node.id) ? 'black' : 'white') as 'white' | 'gray' | 'black'
      }));

      states.push({
        nodes: updatedNodes,
        edges: states[states.length - 1].edges,
        whiteNodes: Array.from(whiteNodes),
        grayNodes: Array.from(grayNodes),
        blackNodes: Array.from(blackNodes),
        current: null,
        stack: [...stack]
      });

      // If we found the end node, reconstruct and highlight the path
      if (endNode && current === endNode) {
        const path = reconstructPath(parent, startNode, endNode);
        
        // State: Highlight the path found
        const finalNodes = updatedNodes.map(node => ({
          ...node,
          status: (path.includes(node.id) ? 'path' : node.status) as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end' | 'white' | 'gray' | 'black'
        }));

        const finalEdges = states[states.length - 1].edges.map(edge => ({
          ...edge,
          status: (path.includes(edge.from) && path.includes(edge.to) ? 'path' : edge.status) as 'normal' | 'visited' | 'path' | 'current'
        }));

        states.push({
          nodes: finalNodes,
          edges: finalEdges,
          whiteNodes: Array.from(whiteNodes),
          grayNodes: Array.from(grayNodes),
          blackNodes: Array.from(blackNodes),
          current: null,
          stack: [...stack],
          path
        });
        
        break; // Exit early since we found the target
      }
    }
  }

  return states;
}

/**
 * Reconstruct Path
 * 
 * Helper function to reconstruct the path from start to end node
 * using the parent map built during tricolor traversal.
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
