/**
 * A* Algorithm Implementation
 * 
 * This file contains the A* pathfinding algorithm that generates visualization states
 * for the graph visualizer. Each step shows the current node being processed,
 * the open set (nodes to be evaluated), the closed set (evaluated nodes),
 * and the path being constructed.
 */

/**
 * Node Interface
 * 
 * Represents a vertex in the graph with position, cost, and status information
 * for visualization purposes.
 */
export interface Node {
  id: string;                                    // Unique node identifier
  x: number;                                     // X coordinate for visualization
  y: number;                                     // Y coordinate for visualization
  status: 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end' | 'open' | 'closed';  // Visual status
  g: number;                                     // Cost from start to this node
  h: number;                                     // Heuristic cost from this node to goal
  f: number;                                     // Total cost (g + h)
  parent?: string;                               // Parent node for path reconstruction
}

/**
 * Edge Interface
 * 
 * Represents a connection between two nodes with weight and status
 * for visualization.
 */
export interface Edge {
  from: string;                                  // Source node ID
  to: string;                                    // Target node ID
  weight: number;                                // Edge weight
  status: 'normal' | 'visited' | 'path' | 'current';  // Visual status
}

/**
 * Graph State Interface
 * 
 * Defines the structure for each visualization state in the A* animation.
 * Each state represents a snapshot of the pathfinding process at a specific point.
 */
export interface GraphState {
  nodes: Node[];         // Current state of all nodes
  edges: Edge[];         // Current state of all edges
  openSet: string[];     // Nodes to be evaluated (priority queue)
  closedSet: string[];   // Already evaluated nodes
  current: string | null; // Currently processing node ID
  path: string[];        // Current best path found
}

/**
 * A* Algorithm
 * 
 * Implements A* pathfinding and generates visualization states for each step.
 * A* uses a heuristic function to estimate the cost to reach the goal,
 * making it more efficient than Dijkstra's algorithm for pathfinding.
 * 
 * @param nodes - Array of graph nodes
 * @param edges - Array of graph edges
 * @param startNode - Starting node for the pathfinding
 * @param endNode - Target node for the pathfinding
 * @returns Array of visualization states showing each step of the algorithm
 */
export function aStar(
  nodes: Node[],
  edges: Edge[],
  startNode: string,
  endNode: string
): GraphState[] {
  const states: GraphState[] = [];
  const openSet: string[] = [startNode];
  const closedSet: Set<string> = new Set();
  const gScore: Map<string, number> = new Map();
  const fScore: Map<string, number> = new Map();
  const parent: Map<string, string> = new Map();

  // Initialize scores
  nodes.forEach(node => {
    gScore.set(node.id, Infinity);
    fScore.set(node.id, Infinity);
  });
  
  gScore.set(startNode, 0);
  fScore.set(startNode, heuristic(nodes, startNode, endNode));

  // Initialize first state - shows the starting configuration
  const initialNodes = nodes.map(node => ({
    ...node,
    status: (node.id === startNode ? 'start' : 
             node.id === endNode ? 'end' : 'unvisited') as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end' | 'open' | 'closed',
    g: gScore.get(node.id) || 0,
    h: heuristic(nodes, node.id, endNode),
    f: fScore.get(node.id) || 0
  }));

  states.push({
    nodes: initialNodes,
    edges: edges.map(edge => ({ ...edge, status: 'normal' })),
    openSet: [...openSet],
    closedSet: [],
    current: null,
    path: []
  });

  // Main A* loop
  while (openSet.length > 0) {
    // Find node with lowest f score
    let current = openSet[0];
    let currentIndex = 0;
    
    for (let i = 1; i < openSet.length; i++) {
      const fCurrent = fScore.get(current) || Infinity;
      const fCandidate = fScore.get(openSet[i]) || Infinity;
      if (fCandidate < fCurrent) {
        current = openSet[i];
        currentIndex = i;
      }
    }

    // Remove current from open set and add to closed set
    openSet.splice(currentIndex, 1);
    closedSet.add(current);

    // State: Show the current node being processed
    const updatedNodes = states[states.length - 1].nodes.map(node => ({
      ...node,
      status: (node.id === current ? 'current' : 
               node.id === startNode ? 'start' :
               node.id === endNode ? 'end' :
               closedSet.has(node.id) ? 'closed' :
               openSet.includes(node.id) ? 'open' : 'unvisited') as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end' | 'open' | 'closed',
      g: gScore.get(node.id) || 0,
      h: heuristic(nodes, node.id, endNode),
      f: fScore.get(node.id) || 0
    }));

    states.push({
      nodes: updatedNodes,
      edges: states[states.length - 1].edges,
      openSet: [...openSet],
      closedSet: Array.from(closedSet),
      current,
      path: []
    });

    // Check if we reached the goal
    if (current === endNode) {
      const path = reconstructPath(parent, startNode, endNode);
      
      // State: Highlight the final path
      const finalNodes = updatedNodes.map(node => ({
        ...node,
        status: (path.includes(node.id) ? 'path' : node.status) as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end' | 'open' | 'closed'
      }));

      const finalEdges = states[states.length - 1].edges.map(edge => ({
        ...edge,
        status: (path.includes(edge.from) && path.includes(edge.to) ? 'path' : edge.status) as 'normal' | 'visited' | 'path' | 'current'
      }));

      states.push({
        nodes: finalNodes,
        edges: finalEdges,
        openSet: [...openSet],
        closedSet: Array.from(closedSet),
        current,
        path
      });
      
      break;
    }

    // Get neighbors of current node
    const neighbors = edges
      .filter(edge => edge.from === current || edge.to === current)
      .map(edge => edge.from === current ? edge.to : edge.from);

    // Process each neighbor
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor)) continue;

      const edge = edges.find(e => 
        (e.from === current && e.to === neighbor) || 
        (e.to === current && e.from === neighbor)
      );
      
      if (!edge) continue;

      const tentativeGScore = (gScore.get(current) || 0) + edge.weight;

      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeGScore >= (gScore.get(neighbor) || Infinity)) {
        continue;
      }

      // This path is better than any previous one
      parent.set(neighbor, current);
      gScore.set(neighbor, tentativeGScore);
      fScore.set(neighbor, tentativeGScore + heuristic(nodes, neighbor, endNode));

      // State: Show the edge being evaluated
      const updatedEdges = states[states.length - 1].edges.map(e => ({
        ...e,
        status: ((e.from === current && e.to === neighbor) ||
                (e.to === current && e.from === neighbor) ? 'current' : e.status) as 'normal' | 'visited' | 'path' | 'current'
      }));

      const neighborUpdatedNodes = updatedNodes.map(node => ({
        ...node,
        status: (node.id === neighbor ? 'open' : node.status) as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end' | 'open' | 'closed',
        g: gScore.get(node.id) || 0,
        h: heuristic(nodes, node.id, endNode),
        f: fScore.get(node.id) || 0
      }));

      states.push({
        nodes: neighborUpdatedNodes,
        edges: updatedEdges,
        openSet: [...openSet],
        closedSet: Array.from(closedSet),
        current,
        path: []
      });
    }
  }

  return states;
}

/**
 * Heuristic Function
 * 
 * Calculates the heuristic cost (h) from a node to the goal.
 * Uses Euclidean distance as the heuristic for A* pathfinding.
 * 
 * @param nodes - Array of all nodes
 * @param from - Source node ID
 * @param to - Target node ID
 * @returns Heuristic cost estimate
 */
function heuristic(nodes: Node[], from: string, to: string): number {
  const fromNode = nodes.find(n => n.id === from);
  const toNode = nodes.find(n => n.id === to);
  
  if (!fromNode || !toNode) return 0;
  
  const dx = fromNode.x - toNode.x;
  const dy = fromNode.y - toNode.y;
  
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Reconstruct Path
 * 
 * Helper function to reconstruct the optimal path from start to end node
 * using the parent map built during A* traversal.
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
