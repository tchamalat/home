'use client';

import { Section } from '@/components/Section';
import { useEffect, useState } from 'react';

interface LogEntry {
  container: string;
  log: string;
  timestamp: string;
}

type Props = {
  dict: Record<"dockerlogs.title" | "dockerlogs.connected" | "dockerlogs.disconnected" | "dockerlogs.clear" | "dockerlogs.waiting", string>;
};

export default function DockerLogs({ dict }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const maxLogs = 30;

  useEffect(() => {
    const eventSource = new EventSource('/api/docker/logs');

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const logEntry: LogEntry = JSON.parse(event.data);
        setLogs((prev) => {
          const newLogs = [...prev, logEntry];
          return newLogs.slice(-maxLogs);
        });
      } catch (error) {
        console.error('Error parsing log:', error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const getLogColor = (log: string) => {
    if (log.toLowerCase().includes('error')) return 'text-error';
    if (log.toLowerCase().includes('warn')) return 'text-warning';
    if (log.toLowerCase().includes('success') || log.toLowerCase().includes('done')) return 'text-success';
    return 'text-base-content';
  };

  return (
    <Section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{dict["dockerlogs.title"]}</h2>
        <div className="flex items-center gap-2">
          <div className={`badge ${isConnected ? 'badge-success' : 'badge-error'}`}>
            {isConnected ? dict["dockerlogs.connected"] : dict["dockerlogs.disconnected"]}
          </div>
          <button 
            className="btn btn-sm btn-ghost rounded-full"
            onClick={() => setLogs([])}
          >
            {dict["dockerlogs.clear"]}
          </button>
        </div>
      </div>

      <div className="mockup-code bg-base-200/90 border border-primary/10 overflow-y-auto">
        {logs.length === 0 ? (
          <pre data-prefix="$" className="text-base-content/50">
            <code>{dict["dockerlogs.waiting"]}</code>
          </pre>
        ) : (
          logs.map((entry, index) => (
            <pre 
              key={index} 
              data-prefix={`[${entry.container}]`}
              className={`${getLogColor(entry.log)}`}
            >
              <code className="pl-3 inline-block">{entry.log}</code>
            </pre>
          ))
        )}
      </div>
    </Section>
  );
}