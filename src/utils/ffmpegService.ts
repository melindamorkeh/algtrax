/**
 * FFmpeg Service for GIF Export
 * 
 * This service uses ffmpeg.wasm to create high-quality GIF animations
 * from algorithm visualization frames. It provides:
 * - Frame capture from canvas elements
 * - GIF generation with customizable settings
 * - Download functionality
 * - Progress tracking for long operations
 */

import { loadFFmpegModules, getFFmpeg, getFetchFile, getToBlobURL, areModulesLoaded } from './ffmpegLoaderRuntime';

// Only import ffmpeg.wasm on the client side
const isClient = typeof window !== 'undefined';

export interface GifExportOptions {
  width?: number;
  height?: number;
  fps?: number;
  quality?: number;
  loop?: boolean;
}

export interface GifExportProgress {
  progress: number;
  stage: 'loading' | 'processing' | 'encoding' | 'complete' | 'error';
  message: string;
}

export class FFmpegService {
  private ffmpeg: any = null;
  private isLoaded: boolean = false;
  private baseURL: string = 'https://unpkg.com/@ffmpeg/core@0.12.15/dist/esm';

  constructor() {
    // FFmpeg will be initialized when load() is called
  }

  /**
   * Setup event handlers for progress tracking
   */
  private setupEventHandlers() {
    if (!this.ffmpeg) return;
    
    this.ffmpeg.on('log', ({ message }: { message: string }) => {
      console.log('FFmpeg log:', message);
    });

    this.ffmpeg.on('progress', ({ progress, time }: { progress: number; time: number }) => {
      console.log(`FFmpeg progress: ${Math.round(progress * 100)}% (${time}ms)`);
    });
  }

  /**
   * Load FFmpeg core if not already loaded
   */
  async load(): Promise<void> {
    if (!isClient) {
      throw new Error('FFmpeg.wasm is only available on the client side');
    }
    
    if (this.isLoaded) return;

    try {
      // Load FFmpeg modules if not already loaded
      const modulesLoaded = await loadFFmpegModules();
      if (!modulesLoaded) {
        console.warn('FFmpeg modules not available - GIF export will be disabled');
        return; // Don't throw error, just disable functionality
      }

      const FFmpeg = getFFmpeg();
      const toBlobURL = getToBlobURL();

      if (!FFmpeg || !toBlobURL) {
        console.warn('FFmpeg modules not available - GIF export will be disabled');
        return; // Don't throw error, just disable functionality
      }

      // Initialize FFmpeg instance
      this.ffmpeg = new FFmpeg();
      this.setupEventHandlers();

      // Load FFmpeg core with fallback for worker issues
      try {
        await this.ffmpeg.load({
          coreURL: await toBlobURL(`${this.baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${this.baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
          workerURL: await toBlobURL(`${this.baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
        });
      } catch (workerError) {
        console.warn('Failed to load with worker, trying without:', workerError);
        // Fallback: load without explicit worker URL
        await this.ffmpeg.load({
          coreURL: await toBlobURL(`${this.baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${this.baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
      }

      this.isLoaded = true;
      console.log('FFmpeg loaded successfully');
    } catch (error) {
      console.warn('Failed to load FFmpeg - GIF export will be disabled:', error);
      // Don't throw error, just disable functionality
    }
  }

  /**
   * Capture frames from a canvas element
   */
  async captureFrame(canvas: HTMLCanvasElement): Promise<Uint8Array> {
    if (!isClient) {
      throw new Error('Frame capture is only available on the client side');
    }
    
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to capture frame'));
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          resolve(new Uint8Array(arrayBuffer));
        };
        reader.onerror = () => reject(new Error('Failed to read frame data'));
        reader.readAsArrayBuffer(blob);
      }, 'image/png');
    });
  }

  /**
   * Generate GIF from canvas frames using FFmpeg
   */
  async generateGif(
    frames: Uint8Array[],
    options: GifExportOptions = {},
    onProgress?: (progress: GifExportProgress) => void
  ): Promise<Blob> {
    if (!isClient) {
      throw new Error('GIF generation is only available on the client side');
    }
    
    if (!this.isLoaded) {
      await this.load();
    }
    
    if (!this.ffmpeg) {
      throw new Error('FFmpeg is not available - GIF export is disabled');
    }

    const {
      width = 800,
      height = 600,
      fps = 10,
      quality = 10,
      loop = true
    } = options;

    try {
      // Clear any existing files
      await this.ffmpeg.deleteFile('output.gif');

      // Write frame files
      onProgress?.({ progress: 0, stage: 'processing', message: 'Preparing frames...' });
      
      for (let i = 0; i < frames.length; i++) {
        const filename = `frame${i.toString().padStart(4, '0')}.png`;
        await this.ffmpeg.writeFile(filename, frames[i]);
      }

      // Create input file list for FFmpeg
      const inputList = frames.map((_, i) => `frame${i.toString().padStart(4, '0')}.png`).join('|');
      
      // FFmpeg command for GIF generation
      const command = [
        '-framerate', fps.toString(),
        '-i', `concat:${inputList}`,
        '-vf', `scale=${width}:${height}:flags=lanczos,palettegen=reserve_transparent=0:stats_mode=single[pal];[0:v][pal]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`,
        '-loop', loop ? '0' : '-1',
        '-y',
        'output.gif'
      ];

      onProgress?.({ progress: 20, stage: 'encoding', message: 'Encoding GIF...' });

      // Execute FFmpeg command
      await this.ffmpeg.exec(command);

      // Read the output file
      const data = await this.ffmpeg.readFile('output.gif');
      const blob = new Blob([data as unknown as BlobPart], { type: 'image/gif' });

      // Clean up frame files
      for (let i = 0; i < frames.length; i++) {
        const filename = `frame${i.toString().padStart(4, '0')}.png`;
        try {
          await this.ffmpeg.deleteFile(filename);
        } catch (error) {
          // Ignore cleanup errors
        }
      }

      onProgress?.({ progress: 100, stage: 'complete', message: 'GIF created successfully!' });

      return blob;
    } catch (error) {
      console.error('GIF generation failed:', error);
      onProgress?.({ progress: 0, stage: 'error', message: `GIF generation failed: ${error}` });
      throw error;
    }
  }

  /**
   * Generate GIF from canvas frames with simpler method (for better compatibility)
   */
  async generateGifSimple(
    frames: Uint8Array[],
    options: GifExportOptions = {},
    onProgress?: (progress: GifExportProgress) => void
  ): Promise<Blob> {
    if (!isClient) {
      throw new Error('GIF generation is only available on the client side');
    }
    
    if (!this.isLoaded) {
      await this.load();
    }
    
    if (!this.ffmpeg) {
      throw new Error('FFmpeg is not available - GIF export is disabled');
    }

    const {
      width = 800,
      height = 600,
      fps = 10,
      quality = 10
    } = options;

    try {
      // Clear any existing files
      await this.ffmpeg.deleteFile('output.gif');

      // Write frame files
      onProgress?.({ progress: 0, stage: 'processing', message: 'Preparing frames...' });
      
      for (let i = 0; i < frames.length; i++) {
        const filename = `frame${i.toString().padStart(4, '0')}.png`;
        await this.ffmpeg.writeFile(filename, frames[i]);
      }

      // Create a simpler GIF using FFmpeg's built-in palette generation
      const command = [
        '-framerate', fps.toString(),
        '-i', 'frame%04d.png',
        '-vf', `scale=${width}:${height},palettegen=stats_mode=single[pal];[0:v][pal]paletteuse`,
        '-loop', '0',
        '-y',
        'output.gif'
      ];

      onProgress?.({ progress: 20, stage: 'encoding', message: 'Encoding GIF...' });

      // Execute FFmpeg command
      await this.ffmpeg.exec(command);

      // Read the output file
      const data = await this.ffmpeg.readFile('output.gif');
      const blob = new Blob([data as unknown as BlobPart], { type: 'image/gif' });

      // Clean up frame files
      for (let i = 0; i < frames.length; i++) {
        const filename = `frame${i.toString().padStart(4, '0')}.png`;
        try {
          await this.ffmpeg.deleteFile(filename);
        } catch (error) {
          // Ignore cleanup errors
        }
      }

      onProgress?.({ progress: 100, stage: 'complete', message: 'GIF created successfully!' });

      return blob;
    } catch (error) {
      console.error('GIF generation failed:', error);
      onProgress?.({ progress: 0, stage: 'error', message: `GIF generation failed: ${error}` });
      throw error;
    }
  }

  /**
   * Download a blob as a file
   */
  downloadBlob(blob: Blob, filename: string): void {
    if (!isClient) {
      throw new Error('Download is only available on the client side');
    }
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Check if FFmpeg is loaded and ready
   */
  get loaded(): boolean {
    return this.isLoaded;
  }
}

// Export singleton instance
export const ffmpegService = new FFmpegService();
