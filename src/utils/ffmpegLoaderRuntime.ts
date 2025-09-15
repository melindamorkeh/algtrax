/**
 * Runtime FFmpeg Loader
 * 
 * This loader uses runtime evaluation to avoid build-time import issues
 * with bundlers like Turbopack that have trouble with dynamic imports.
 */

// Only run on client side
const isClient = typeof window !== 'undefined';

// Cache for loaded modules
let ffmpegModule: any = null;
let utilModule: any = null;
let loadPromise: Promise<boolean> | null = null;

/**
 * Load FFmpeg modules using runtime evaluation
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
      // Check if we're in a browser environment that supports dynamic imports
      if (typeof window === 'undefined' || !window.fetch) {
        console.warn('Browser environment not suitable for FFmpeg');
        return false;
      }

      // Try to load modules using fetch and eval (for environments where dynamic import fails)
      const loadModuleFromCDN = async (packageName: string, version: string, exportName: string) => {
        try {
          const url = `https://unpkg.com/${packageName}@${version}/dist/esm/index.js`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${packageName}: ${response.status}`);
          }
          
          const code = await response.text();
          
          // Create a safe evaluation context
          const module = { exports: {} };
          const exports = {};
          const require = () => { throw new Error('require not available'); };
          
          // Evaluate the module code
          const func = new Function('module', 'exports', 'require', code);
          func(module, exports, require);
          
          return module.exports[exportName];
        } catch (error) {
          console.warn(`Failed to load ${packageName} from CDN:`, error);
          return null;
        }
      };

      // Try to load FFmpeg modules
      const [FFmpeg, fetchFile, toBlobURL] = await Promise.all([
        loadModuleFromCDN('@ffmpeg/ffmpeg', '0.12.15', 'FFmpeg'),
        loadModuleFromCDN('@ffmpeg/util', '0.12.2', 'fetchFile'),
        loadModuleFromCDN('@ffmpeg/util', '0.12.2', 'toBlobURL')
      ]);

      if (!FFmpeg || !fetchFile || !toBlobURL) {
        console.warn('FFmpeg modules not available - GIF export will be disabled');
        return false;
      }

      ffmpegModule = { FFmpeg };
      utilModule = { fetchFile, toBlobURL };
      
      console.log('FFmpeg modules loaded successfully from CDN');
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
