'use client';

import { useEffect, useRef, useState } from 'react';

interface Node {
  id: string;
  x: number;
  y: number;
  status: 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end' | 'white' | 'gray' | 'black' | 'open' | 'closed';
  distance?: number;
}

interface Edge {
  from: string;
  to: string;
  weight?: number;
  status: 'normal' | 'visited' | 'path' | 'current';
}

interface GraphRendererProps {
  nodes: Node[];
  edges: Edge[];
  width?: number;
  height?: number;
}

// Helper function to calculate the bounding box of the original graph
function calculateOriginalBounds(nodes: Node[]) {
  if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 };
  
  const minX = Math.min(...nodes.map(n => n.x));
  const maxX = Math.max(...nodes.map(n => n.x));
  const minY = Math.min(...nodes.map(n => n.y));
  const maxY = Math.max(...nodes.map(n => n.y));
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

// Helper function to scale and translate coordinates
function transformCoordinates(x: number, y: number, originalBounds: any, scale: number, offsetX: number, offsetY: number) {
  const scaledX = (x - originalBounds.minX) * scale + offsetX;
  const scaledY = (y - originalBounds.minY) * scale + offsetY;
  return { x: scaledX, y: scaledY };
}

export function GraphRenderer({ nodes, edges, width = 1000, height = 400 }: GraphRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 400 });

  // Handle responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const newWidth = Math.max(400, rect.width - 20); // Min width 400px, with padding
        const newHeight = Math.max(300, rect.height - 20); // Min height 300px, with padding
        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    // Use a small delay to ensure the container is rendered
    const timeoutId = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scaling factors to fill the available space
    const originalBounds = calculateOriginalBounds(nodes);
    const padding = 60; // Padding around the graph
    const availableWidth = dimensions.width - (padding * 2);
    const availableHeight = dimensions.height - (padding * 2);
    
    const scaleX = originalBounds.width > 0 ? availableWidth / originalBounds.width : 1;
    const scaleY = originalBounds.height > 0 ? availableHeight / originalBounds.height : 1;
    const scale = Math.min(scaleX, scaleY, 2); // Cap scaling at 2x to prevent huge graphs
    
    // Calculate offset to center the graph
    const scaledWidth = originalBounds.width * scale;
    const scaledHeight = originalBounds.height * scale;
    const offsetX = (dimensions.width - scaledWidth) / 2;
    const offsetY = (dimensions.height - scaledHeight) / 2;

    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (!fromNode || !toNode) return;

      // Transform coordinates
      const fromPos = transformCoordinates(fromNode.x, fromNode.y, originalBounds, scale, offsetX, offsetY);
      const toPos = transformCoordinates(toNode.x, toNode.y, originalBounds, scale, offsetX, offsetY);

      // Set edge color based on status
      switch (edge.status) {
        case 'visited':
          ctx.strokeStyle = '#10b981'; // green
          ctx.lineWidth = Math.max(2, 3 * scale); // Scale line width
          break;
        case 'path':
          ctx.strokeStyle = '#f59e0b'; // yellow
          ctx.lineWidth = Math.max(3, 4 * scale); // Scale line width
          break;
        case 'current':
          ctx.strokeStyle = '#3b82f6'; // blue
          ctx.lineWidth = Math.max(2, 3 * scale); // Scale line width
          break;
        default:
          ctx.strokeStyle = '#6b7280'; // gray
          ctx.lineWidth = Math.max(1, 2 * scale); // Scale line width
      }

      ctx.beginPath();
      ctx.moveTo(fromPos.x, fromPos.y);
      ctx.lineTo(toPos.x, toPos.y);
      ctx.stroke();

      // Draw weight if weighted
      if (edge.weight !== undefined) {
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        
        ctx.fillStyle = '#374151';
        ctx.font = `${Math.max(10, 12 * scale)}px Arial`; // Scale font size
        ctx.textAlign = 'center';
        ctx.fillText(edge.weight.toString(), midX, midY - 5);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      // Transform coordinates
      const pos = transformCoordinates(node.x, node.y, originalBounds, scale, offsetX, offsetY);
      const radius = Math.max(15, 20 * scale); // Scale node radius
      
      // Set node color based on status
      switch (node.status) {
        case 'start':
          ctx.fillStyle = '#10b981'; // green
          break;
        case 'end':
          ctx.fillStyle = '#ef4444'; // red
          break;
        case 'current':
          ctx.fillStyle = '#3b82f6'; // blue
          break;
        case 'visited':
          ctx.fillStyle = '#8b5cf6'; // purple
          break;
        case 'path':
          ctx.fillStyle = '#f59e0b'; // yellow
          break;
        case 'white':
          ctx.fillStyle = '#f3f4f6'; // light gray
          break;
        case 'gray':
          ctx.fillStyle = '#6b7280'; // medium gray
          break;
        case 'black':
          ctx.fillStyle = '#1f2937'; // dark gray
          break;
        case 'open':
          ctx.fillStyle = '#3b82f6'; // blue
          break;
        case 'closed':
          ctx.fillStyle = '#8b5cf6'; // purple
          break;
        default:
          ctx.fillStyle = '#6b7280'; // gray
      }

      // Draw node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw node border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(1, 2 * scale); // Scale border width
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.max(10, 14 * scale)}px Arial`; // Scale font size
      ctx.textAlign = 'center';
      ctx.fillText(node.id, pos.x, pos.y + 4);

      // Draw distance if available
      if (node.distance !== undefined && node.distance !== Infinity) {
        ctx.fillStyle = '#374151';
        ctx.font = `${Math.max(8, 10 * scale)}px Arial`; // Scale font size
        ctx.fillText(node.distance.toString(), pos.x, pos.y + radius + 15);
      }
    });
  }, [nodes, edges, dimensions]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="border border-gray-200 dark:border-gray-600 rounded-lg max-w-full max-h-full"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
} 