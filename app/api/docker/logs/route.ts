import Docker from 'dockerode';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const docker = new Docker();

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await docker.ping();
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
              
              console.log(`[LOGS] Reçu ${lines.length} lignes du conteneur ${containerInfo.Names[0]}`);
              
              lines.forEach((line: string) => {
                const cleanLine = line.replace(/[\x00-\x08]/g, '');
                const data = JSON.stringify({
                  container: containerInfo.Names[0].replace('/', ''),
                  log: cleanLine,
                  timestamp: new Date().toISOString(),
                }) + '\n';
                
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              });
            });

            logStream.on('end', () => {
              console.log(`[LOGS] Stream fermé pour ${containerInfo.Names[0]}`);
            });

            logStream.on('error', (err) => {
              console.error(`[LOGS] Erreur stream ${containerInfo.Names[0]}:`, err);
            });

            return logStream;
          })
        );

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
        const errMsg = JSON.stringify({ error: 'docker_logs_unavailable', message: (error as Error)?.message || 'Unknown error' });
        controller.enqueue(encoder.encode(`event: error\n`));
        controller.enqueue(encoder.encode(`data: ${errMsg}\n\n`));
        controller.close();
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