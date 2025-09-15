import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer, webpack }) => {
    // Fix for ffmpeg.wasm module resolution
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
      };
    }

    // Handle FFmpeg worker files and dynamic imports
    config.module.rules.push({
      test: /node_modules\/@ffmpeg\/.*\.js$/,
      type: 'javascript/auto',
    });

    // Handle worker files
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { 
        loader: 'worker-loader',
        options: {
          name: 'static/[hash].worker.js',
          publicPath: '/_next/',
        }
      }
    });

    // Ignore dynamic imports that can't be resolved at build time
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/worker$/,
        contextRegExp: /@ffmpeg\/ffmpeg/,
      })
    );

    // Handle dynamic worker creation
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ffmpeg/ffmpeg': '@ffmpeg/ffmpeg/dist/esm/index.js',
    };

    return config;
  },
  transpilePackages: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  // Turbopack configuration
  turbo: {
    rules: {
      '*.js': {
        loaders: ['swc-loader'],
        as: '*.js',
      },
    },
    resolveAlias: {
      '@ffmpeg/ffmpeg': '@ffmpeg/ffmpeg/dist/esm/index.js',
    },
  },
};

export default nextConfig;
