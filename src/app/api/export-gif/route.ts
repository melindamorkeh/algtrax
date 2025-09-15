import { NextResponse } from "next/server";

/**
 * GIF Export API Route
 * 
 * This route is deprecated in favor of client-side GIF generation using ffmpeg.wasm.
 * The new implementation provides better performance and quality while reducing server load.
 * 
 * The GIF export functionality has been moved to the client-side using FFmpeg.wasm
 * in the GifExporter component for better user experience and performance.
 */

export async function POST(request: Request) {
  return NextResponse.json(
    { 
      error: 'This API route is deprecated. GIF export is now handled client-side using ffmpeg.wasm.',
      message: 'Please use the Export GIF button in the visualizer interface.'
    },
    { status: 410 } // Gone - resource no longer available
  );
}
