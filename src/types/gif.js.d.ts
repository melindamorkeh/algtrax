declare module 'gif.js' {
  interface GIFOptions {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    workerScript?: string;
    background?: string;
    transparent?: string;
  }

  interface FrameOptions {
    delay?: number;
    copy?: boolean;
  }

  class GIF {
    constructor(options?: GIFOptions);
    addFrame(image: any, options?: FrameOptions): void;
    on(event: 'finished', callback: (blob: Blob) => void): void;
    on(event: 'error', callback: (error: any) => void): void;
    render(): void;
  }

  export default GIF;
} 