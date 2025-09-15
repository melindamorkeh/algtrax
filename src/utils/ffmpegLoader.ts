/**
 * FFmpeg Loader Utility
 * 
 * This utility handles the dynamic loading of FFmpeg modules
 * and provides a fallback mechanism for environments where
 * dynamic imports fail (like certain bundler configurations).
 */

// Only run on client side
const isClient = typeof window !== 'undefined';

// Cache for loaded modules
let ffmpegModule: any = null;
let utilModule: any = null;
let loadPromise: Promise<boolean> | null = null;

/**
 * Load FFmpeg modules with error handling and retry logic
 */
export async function loadFFmpegModules(): Promise<boolean> {
  if (!isClient) {
    console.warn('FFmpeg modules can only be loaded on the client side');
    return false;
  }

  // Return cached promise if already loading
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      // Use a try-catch wrapper to handle any import issues
      let ffmpeg: any = null;
      let util: any = null;

      try {
        // Try dynamic import with error handling
        const ffmpegPromise = import('@ffmpeg/ffmpeg').catch(() => null);
        const utilPromise = import('@ffmpeg/util').catch(() => null);
        
        const results = await Promise.allSettled([ffmpegPromise, utilPromise]);
        
        if (results[0].status === 'fulfilled' && results[0].value) {
          ffmpeg = results[0].value;
        }
        if (results[1].status === 'fulfilled' && results[1].value) {
          util = results[1].value;
        }
      } catch (error) {
        console.warn('Dynamic import failed:', error);
      }

      if (!ffmpeg || !util) {
        console.warn('FFmpeg modules not available - GIF export will be disabled');
        return false;
      }

      ffmpegModule = ffmpeg;
      utilModule = util;
      
      console.log('FFmpeg modules loaded successfully');
      return true;
    } catch (error) {
      console.warn('Failed to load FFmpeg modules - GIF export will be disabled:', error);
      return false;
    }
  })();

  return loadPromise;
}

/**
 * Get the FFmpeg class
 */
export function getFFmpeg(): any {
  return ffmpegModule?.FFmpeg || null;
}

/**
 * Get the fetchFile function
 */
export function getFetchFile(): any {
  return utilModule?.fetchFile || null;
}

/**
 * Get the toBlobURL function
 */
export function getToBlobURL(): any {
  return utilModule?.toBlobURL || null;
}

/**
 * Check if modules are loaded
 */
export function areModulesLoaded(): boolean {
  return !!(ffmpegModule && utilModule);
}

/**
 * Reset the loader state (useful for testing)
 */
export function resetLoader(): void {
  ffmpegModule = null;
  utilModule = null;
  loadPromise = null;
}
