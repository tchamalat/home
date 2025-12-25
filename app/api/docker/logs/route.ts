import Docker from 'dockerode';
import { NextRequest } from 'next/server';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const containers = await docker.listContainers();
        
        const logStreams = await Promise.all(
          containers.map(async (containerInfo) => {
            const container = docker.getContainer(containerInfo.Id);
            const logStream = await container.logs({
              follow: true,
              stdout: true,
              stderr: true,
              tail: 50,
              timestamps: true,
            });

            logStream.on('data', (chunk) => {
              const log = chunk.toString('utf8');
              const lines = log.split('\n').filter((line: string) => line.trim());
              
              lines.forEach((line: string) => {
                // Nettoyer les caractères de contrôle Docker
                const cleanLine = line.replace(/[\x00-\x08]/g, '');
                const data = JSON.stringify({
                  container: containerInfo.Names[0].replace('/', ''),
                  log: cleanLine,
                  timestamp: new Date().toISOString(),
                }) + '\n';
                
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              });
            });

            return logStream;
          })
        );

        // Cleanup on close
        request.signal.addEventListener('abort', () => {
          logStreams.forEach((stream: any) => {
            if (stream && typeof stream.destroy === 'function') {
              stream.destroy();
            }
          });
          controller.close();
        });
      } catch (error) {
        console.error('Error streaming logs:', error);
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}