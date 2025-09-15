/**
 * GIF Exporter Component
 * 
 * This component allows users to export algorithm visualizations as animated GIFs.
 * It provides:
 * - GIF generation from visualization states using FFmpeg.wasm
 * - Customizable export settings (frame rate, quality, dimensions)
 * - Download functionality for sharing visualizations
 * - Integration with the visualization playback system
 * - Progress tracking during export
 * 
 * The exporter captures each frame of the algorithm animation and combines
 * them into a shareable GIF file that can be used for educational purposes.
 */

import { useState, useRef, useCallback } from 'react';
import { ffmpegService, GifExportOptions, GifExportProgress } from '@/utils/ffmpegService';

interface GifExporterProps {
    states: any[];
    algorithmId?: string;
    canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export function GifExporter({ states, algorithmId, canvasRef }: GifExporterProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState<GifExportProgress | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [exportOptions, setExportOptions] = useState<GifExportOptions>({
        width: 800,
        height: 600,
        fps: 10,
        quality: 10,
        loop: true
    });

    /**
     * Capture a single frame from the visualization
     */
    const captureFrame = useCallback(async (stateIndex: number): Promise<Uint8Array | null> => {
        try {
            // Try to use the provided canvas ref first
            if (canvasRef?.current) {
                return await ffmpegService.captureFrame(canvasRef.current);
            }

            // Fallback: create a temporary canvas and render the state
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            canvas.width = exportOptions.width || 800;
            canvas.height = exportOptions.height || 600;

            // Render the visualization state on the canvas
            // This is a simplified version - you might need to customize based on your visualization types
            const state = states[stateIndex];
            if (!state) return null;

            // Clear canvas
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Render based on visualization type
            if (state.values) {
                // Bar chart visualization
                renderBarChart(ctx, state, canvas.width, canvas.height);
            } else if (state.nodes) {
                // Graph visualization
                renderGraph(ctx, state, canvas.width, canvas.height);
            } else if (state.buckets) {
                // Hash table visualization
                renderHashTable(ctx, state, canvas.width, canvas.height);
            }

            return await ffmpegService.captureFrame(canvas);
        } catch (error) {
            console.error('Failed to capture frame:', error);
            return null;
        }
    }, [states, exportOptions, canvasRef]);

    /**
     * Render bar chart visualization on canvas
     */
    const renderBarChart = (ctx: CanvasRenderingContext2D, state: any, width: number, height: number) => {
        const values = state.values || [];
        const comparing = state.comparing || [];
        const swapping = state.swapping || [];
        const sorted = state.sorted || [];
        const searching = state.searching || [];
        const found = state.found || [];

        const barWidth = width / values.length;
        const maxValue = Math.max(...values);

        values.forEach((value: number, index: number) => {
            const barHeight = (value / maxValue) * (height - 100);
            const x = index * barWidth;
            const y = height - 50 - barHeight;

            // Determine bar color
            let color = '#6b7280'; // gray-500
            if (comparing.includes(index)) color = '#fbbf24'; // yellow-400
            else if (swapping.includes(index)) color = '#f87171'; // red-400
            else if (sorted.includes(index)) color = '#4ade80'; // green-400
            else if (searching.includes(index)) color = '#60a5fa'; // blue-400
            else if (found.includes(index)) color = '#10b981'; // green-500

            ctx.fillStyle = color;
            ctx.fillRect(x + 2, y, barWidth - 4, barHeight);

            // Draw value text
            ctx.fillStyle = '#000000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
        });

        // Draw title
        ctx.fillStyle = '#000000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(algorithmId || 'Algorithm Visualization', width / 2, 30);
    };

    /**
     * Render graph visualization on canvas
     */
    const renderGraph = (ctx: CanvasRenderingContext2D, state: any, width: number, height: number) => {
        const { nodes, edges } = state;
        if (!nodes || !edges) return;

        // Draw edges
        edges.forEach((edge: any) => {
            const fromNode = nodes.find((n: any) => n.id === edge.from);
            const toNode = nodes.find((n: any) => n.id === edge.to);
            
            if (fromNode && toNode) {
                ctx.strokeStyle = edge.status === 'path' ? '#10b981' : '#6b7280';
                ctx.lineWidth = edge.status === 'path' ? 3 : 1;
                ctx.beginPath();
                ctx.moveTo(fromNode.x, fromNode.y);
                ctx.lineTo(toNode.x, toNode.y);
                ctx.stroke();
            }
        });

        // Draw nodes
        nodes.forEach((node: any) => {
            let color = '#6b7280'; // gray-500
            if (node.status === 'visited') color = '#60a5fa'; // blue-400
            else if (node.status === 'current') color = '#fbbf24'; // yellow-400
            else if (node.status === 'path') color = '#10b981'; // green-500
            else if (node.status === 'start') color = '#8b5cf6'; // purple-500
            else if (node.status === 'end') color = '#ef4444'; // red-500

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
            ctx.fill();

            // Draw node label
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(node.id, node.x, node.y + 4);
        });
    };

    /**
     * Render hash table visualization on canvas
     */
    const renderHashTable = (ctx: CanvasRenderingContext2D, state: any, width: number, height: number) => {
        const { buckets } = state;
        if (!buckets) return;

        const bucketWidth = width / buckets.length;
        
        buckets.forEach((bucket: any, index: number) => {
            const x = index * bucketWidth;
            const y = 100;

            // Draw bucket
            ctx.strokeStyle = '#6b7280';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 10, y, bucketWidth - 20, height - 150);

            // Draw bucket items
            if (bucket && bucket.length > 0) {
                bucket.forEach((item: any, itemIndex: number) => {
                    const itemY = y + 30 + (itemIndex * 25);
                    ctx.fillStyle = '#60a5fa';
                    ctx.fillRect(x + 15, itemY, bucketWidth - 30, 20);
                    
                    ctx.fillStyle = '#000000';
                    ctx.font = '10px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(item.toString(), x + bucketWidth / 2, itemY + 15);
                });
            }
        });
    };

    /**
     * Handle GIF export
     */
    const handleExport = async () => {
        if (states.length === 0) return;
        
        setIsExporting(true);
        setProgress({ progress: 0, stage: 'loading', message: 'Loading FFmpeg...' });

        try {
            // Capture all frames
            setProgress({ progress: 10, stage: 'processing', message: 'Capturing frames...' });
            
            const frames: Uint8Array[] = [];
            for (let i = 0; i < states.length; i++) {
                const frame = await captureFrame(i);
                if (frame) {
                    frames.push(frame);
                }
                
                // Update progress
                const frameProgress = 10 + ((i / states.length) * 20);
                setProgress({ 
                    progress: frameProgress, 
                    stage: 'processing', 
                    message: `Captured ${i + 1}/${states.length} frames` 
                });
            }

            if (frames.length === 0) {
                throw new Error('No frames captured');
            }

            // Generate GIF
            const blob = await ffmpegService.generateGifSimple(
                frames,
                exportOptions,
                setProgress
            );

            // Download the GIF
            const filename = `${algorithmId || 'algorithm'}_animation.gif`;
            ffmpegService.downloadBlob(blob, filename);

        } catch (error) {
            console.error('Export failed:', error);
            setProgress({ 
                progress: 0, 
                stage: 'error', 
                message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="gif-exporter space-y-2">
            {/* Export Button */}
            <button
                onClick={handleExport}
                disabled={isExporting || states.length === 0}
                className="btn-base btn-secondary text-xs sm:text-sm whitespace-nowrap overflow-hidden"
            >
                <span className="block truncate">
                    {isExporting ? 'Exporting...' : 'Export GIF'}
                </span>
            </button>

            {/* Settings Toggle */}
            <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn-base btn-muted text-xs"
            >
                {showSettings ? 'Hide Settings' : 'Settings'}
            </button>

            {/* Export Settings */}
            {showSettings && (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Width
                            </label>
                            <input
                                type="number"
                                value={exportOptions.width}
                                onChange={(e) => setExportOptions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                                className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                                min="100"
                                max="1920"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Height
                            </label>
                            <input
                                type="number"
                                value={exportOptions.height}
                                onChange={(e) => setExportOptions(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                                className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                                min="100"
                                max="1080"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            FPS: {exportOptions.fps}
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="30"
                            value={exportOptions.fps}
                            onChange={(e) => setExportOptions(prev => ({ ...prev, fps: parseInt(e.target.value) }))}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Quality: {exportOptions.quality}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={exportOptions.quality}
                            onChange={(e) => setExportOptions(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                            className="w-full"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="loop"
                            checked={exportOptions.loop}
                            onChange={(e) => setExportOptions(prev => ({ ...prev, loop: e.target.checked }))}
                            className="rounded"
                        />
                        <label htmlFor="loop" className="text-xs text-gray-700 dark:text-gray-300">
                            Loop animation
                        </label>
                    </div>
                </div>
            )}

            {/* Progress Display */}
            {progress && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                            {progress.stage.charAt(0).toUpperCase() + progress.stage.slice(1)}
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-300">
                            {Math.round(progress.progress)}%
                        </span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress.progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        {progress.message}
                    </p>
                </div>
            )}
        </div>
    );
} 