import { NextResponse } from "next/server";
import GIF from "gif.js";

export async function POST(request: Request) {
  try {
    const { frames, delay } = await request.json(); 
    // frames: array of dataURLs (e.g. canvas.toDataURL()), delay in ms

    return new Promise<NextResponse>((resolve, reject) => {
      const gif = new GIF({ 
        workers: 1, // Reduce workers for serverless environment
        quality: 10,
        width: 800,
        height: 600
      });
      
      // Process frames sequentially to avoid memory issues
      const processFrames = async () => {
        for (const url of frames) {
          try {
            // Create a simple image element for gif.js
            const img = {
              width: 800,
              height: 600,
              src: url,
              complete: true
            };
            
            gif.addFrame(img, { delay });
          } catch (error) {
            console.error('Error processing frame:', error);
          }
        }
        
        gif.on("finished", async (blob: Blob) => {
          try {
            const buf = Buffer.from(await blob.arrayBuffer());
            resolve(
              new NextResponse(buf, {
                headers: { 
                  "Content-Type": "image/gif",
                  "Cache-Control": "no-cache"
                },
              })
            );
          } catch (error) {
            reject(new Error('Failed to create GIF'));
          }
        });
        
        gif.on("error", () => {
          reject(new Error('GIF creation failed'));
        });
        
        gif.render();
      };
      
      processFrames();
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process GIF export' },
      { status: 500 }
    );
  }
}
