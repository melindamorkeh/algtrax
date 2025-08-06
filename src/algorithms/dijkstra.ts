export interface Node {
  id: string;
  x: number;
  y: number;
  status: 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end';
  distance?: number;
}

export interface Edge {
  from: string;
  to: string;
  weight: number;
  status: 'normal' | 'visited' | 'path' | 'current';
}

export interface GraphState {
  nodes: Node[];
  edges: Edge[];
  distances: Map<string, number>;
  visited: string[];
  current: string | null;
}

export function dijkstra(
  nodes: Node[],
  edges: Edge[],
  startNode: string,
  endNode?: string
): GraphState[] {
  const states: GraphState[] = [];
  const distances = new Map<string, number>();
  const visited = new Set<string>();
  const parent = new Map<string, string>();

  // Initialize distances
  nodes.forEach(node => {
    distances.set(node.id, node.id === startNode ? 0 : Infinity);
  });

  // Initialize first state
  const initialNodes = nodes.map(node => ({
    ...node,
    status: (node.id === startNode ? 'start' : 'unvisited') as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end',
    distance: distances.get(node.id)
  }));

  states.push({
    nodes: initialNodes,
    edges: edges.map(edge => ({ ...edge, status: 'normal' })),
    distances: new Map(distances),
    visited: [],
    current: null
  });

  while (visited.size < nodes.length) {
    // Find unvisited node with minimum distance
    let current = '';
    let minDistance = Infinity;
    
    for (const [nodeId, distance] of distances) {
      if (!visited.has(nodeId) && distance < minDistance) {
        minDistance = distance;
        current = nodeId;
      }
    }

    if (current === '' || minDistance === Infinity) break;

    visited.add(current);

    // Update current node status
    const updatedNodes = states[states.length - 1].nodes.map(node => ({
      ...node,
      status: (node.id === current ? 'current' : 
              visited.has(node.id) ? 'visited' : node.status) as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end',
      distance: distances.get(node.id)
    }));

    states.push({
      nodes: updatedNodes,
      edges: states[states.length - 1].edges,
      distances: new Map(distances),
      visited: Array.from(visited),
      current
    });

    // Find neighbors and update distances
    const neighbors = edges
      .filter(edge => edge.from === current || edge.to === current)
      .map(edge => ({
        node: edge.from === current ? edge.to : edge.from,
        weight: edge.weight
      }));

    for (const { node: neighbor, weight } of neighbors) {
      if (!visited.has(neighbor)) {
        const newDistance = distances.get(current)! + weight;
        
        if (newDistance < distances.get(neighbor)!) {
          distances.set(neighbor, newDistance);
          parent.set(neighbor, current);

          // Update edge status
          const updatedEdges = states[states.length - 1].edges.map(edge => ({
            ...edge,
            status: (edge.from === current && edge.to === neighbor) ||
                    (edge.to === current && edge.from === neighbor) ? 'current' : edge.status
          }));

          states.push({
            nodes: updatedNodes.map(n => ({
              ...n,
              distance: distances.get(n.id)
            })),
            edges: updatedEdges,
            distances: new Map(distances),
            visited: Array.from(visited),
            current
          });
        }
      }
    }

    // If we found the end node, reconstruct path
    if (endNode && current === endNode) {
      const path = reconstructPath(parent, startNode, endNode);
      
      // Highlight path
      const finalNodes = updatedNodes.map(node => ({
        ...node,
        status: (path.includes(node.id) ? 'path' : node.status) as 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end',
        distance: distances.get(node.id)
      }));

      const finalEdges = states[states.length - 1].edges.map((edge: Edge) => ({
        ...edge,
        status: (path.includes(edge.from) && path.includes(edge.to) ? 'path' : edge.status) as 'normal' | 'visited' | 'path' | 'current'
      }));

      states.push({
        nodes: finalNodes,
        edges: finalEdges,
        distances: new Map(distances),
        visited: Array.from(visited),
        current
      });
      
      break;
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
