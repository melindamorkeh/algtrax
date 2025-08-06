export interface Node {
  id: string;
  x: number;
  y: number;
  status: 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end';
}

export interface Edge {
  from: string;
  to: string;
  weight?: number;
  status: 'normal' | 'visited' | 'path' | 'current';
}

export interface GraphState {
  nodes: Node[];
  edges: Edge[];
  stack: string[];
  visited: string[];
  current: string | null;
}

export function depthFirstSearch(
  nodes: Node[],
  edges: Edge[],
  startNode: string,
  endNode?: string
): GraphState[] {
  const states: GraphState[] = [];
  const visited: Set<string> = new Set();
  const stack: string[] = [startNode];
  const parent: Map<string, string> = new Map();

  // Initialize first state
  const initialNodes = nodes.map(node => ({
    ...node,
    status: (node.id === startNode ? 'start' : 'unvisited') as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end'
  }));

  states.push({
    nodes: initialNodes,
    edges: edges.map(edge => ({ ...edge, status: 'normal' })),
    stack: [...stack],
    visited: [],
    current: null
  });

  while (stack.length > 0) {
    const current = stack.pop()!;
    
    if (visited.has(current)) continue;
    
    visited.add(current);

    // Update current node status
    const updatedNodes = states[states.length - 1].nodes.map(node => ({
      ...node,
      status: (node.id === current ? 'current' : 
              visited.has(node.id) ? 'visited' : node.status) as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end'
    }));

    states.push({
      nodes: updatedNodes,
      edges: states[states.length - 1].edges,
      stack: [...stack],
      visited: Array.from(visited),
      current
    });

    // If we found the end node, reconstruct path
    if (endNode && current === endNode) {
      const path = reconstructPath(parent, startNode, endNode);
      
      // Highlight path
      const finalNodes = updatedNodes.map(node => ({
        ...node,
        status: (path.includes(node.id) ? 'path' : node.status) as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end'
      }));

      const finalEdges = states[states.length - 1].edges.map(edge => ({
        ...edge,
        status: (path.includes(edge.from) && path.includes(edge.to) ? 'path' : edge.status) as 'normal' | 'visited' | 'path' | 'current'
      }));

      states.push({
        nodes: finalNodes,
        edges: finalEdges,
        stack: [...stack],
        visited: Array.from(visited),
        current
      });
      
      break;
    }

    // Find neighbors and add to stack (in reverse order for correct DFS)
    const neighbors = edges
      .filter(edge => edge.from === current || edge.to === current)
      .map(edge => edge.from === current ? edge.to : edge.from)
      .filter(neighbor => !visited.has(neighbor))
      .reverse(); // Reverse to maintain correct DFS order

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor) && !stack.includes(neighbor)) {
        stack.push(neighbor);
        parent.set(neighbor, current);

        // Update edge status
        const updatedEdges = states[states.length - 1].edges.map(edge => ({
          ...edge,
          status: ((edge.from === current && edge.to === neighbor) ||
                  (edge.to === current && edge.from === neighbor) ? 'current' : edge.status) as 'normal' | 'visited' | 'path' | 'current'
        }));

        states.push({
          nodes: updatedNodes,
          edges: updatedEdges,
          stack: [...stack],
          visited: Array.from(visited),
          current
        });
      }
    }
  }

  return states;
}

function reconstructPath(parent: Map<string, string>, start: string, end: string): string[] {
  const path: string[] = [];
  let current = end;
  
  while (current !== start) {
    path.unshift(current);
    current = parent.get(current) || start;
  }
  
  path.unshift(start);
  return path;
} 