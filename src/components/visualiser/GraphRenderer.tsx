'use client';

import { useEffect, useRef } from 'react';

interface Node {
  id: string;
  x: number;
  y: number;
  status: 'unvisited' | 'visited' | 'current' | 'path' | 'start' | 'end';
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

export function GraphRenderer({ nodes, edges, width = 600, height = 400 }: GraphRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (!fromNode || !toNode) return;

      // Set edge color based on status
      switch (edge.status) {
        case 'visited':
          ctx.strokeStyle = '#10b981'; // green
          ctx.lineWidth = 3;
          break;
        case 'path':
          ctx.strokeStyle = '#f59e0b'; // yellow
          ctx.lineWidth = 4;
          break;
        case 'current':
          ctx.strokeStyle = '#3b82f6'; // blue
          ctx.lineWidth = 3;
          break;
        default:
          ctx.strokeStyle = '#6b7280'; // gray
          ctx.lineWidth = 2;
      }

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.stroke();

      // Draw weight if weighted
      if (edge.weight !== undefined) {
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(edge.weight.toString(), midX, midY - 5);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const radius = 20;
      
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
        default:
          ctx.fillStyle = '#6b7280'; // gray
      }

      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw node border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.id, node.x, node.y + 4);

      // Draw distance if available
      if (node.distance !== undefined && node.distance !== Infinity) {
        ctx.fillStyle = '#374151';
        ctx.font = '10px Arial';
        ctx.fillText(node.distance.toString(), node.x, node.y + radius + 15);
      }
    });
  }, [nodes, edges, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-200 dark:border-gray-600 rounded-lg"
    />
  );
} 