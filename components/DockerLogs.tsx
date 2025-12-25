'use client';

import { Section } from '@/components/Section';
import { useEffect, useRef, useState } from 'react';

interface LogEntry {
  container: string;
  log: string;
  timestamp: string;
}

export default function DockerLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const maxLogs = 100; // Limiter le nombre de logs affichés

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
          // Garder seulement les X derniers logs
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

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (log: string) => {
    if (log.toLowerCase().includes('error')) return 'text-error';
    if (log.toLowerCase().includes('warn')) return 'text-warning';
    if (log.toLowerCase().includes('success') || log.toLowerCase().includes('done')) return 'text-success';
    return 'text-base-content';
  };

  return (
    <Section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Docker Logs</h2>
        <div className="flex items-center gap-2">
          <div className={`badge ${isConnected ? 'badge-success' : 'badge-error'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <button 
            className="btn btn-sm btn-ghost"
            onClick={() => setLogs([])}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mockup-code bg-base-200 max-h-[600px] overflow-y-auto">
        {logs.length === 0 ? (
          <pre data-prefix="$" className="text-base-content/50">
            <code>Waiting for logs...</code>
          </pre>
        ) : (
          logs.map((entry, index) => (
            <pre 
              key={index} 
              data-prefix={`[${entry.container}]`}
              className={getLogColor(entry.log)}
            >
              <code>{entry.log}</code>
            </pre>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </Section>
  );
}