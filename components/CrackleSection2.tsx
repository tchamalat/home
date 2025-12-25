"use client";

import { Section } from "@/components/Section";
import { useCallback, useRef, useEffect } from "react";

export function CrackleSection2() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const syncCanvasSize = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
    
        const rect = container.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.floor(rect.width * ratio));
        canvas.height = Math.max(1, Math.floor(rect.height * ratio));
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }, []);
    
    const whiten = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        syncCanvasSize();
        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const darken = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }, [syncCanvasSize]);

    useEffect(() => {
        const handleResize = () => {
          syncCanvasSize();
          darken();
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, [darken, syncCanvasSize]);
    
    return (
    <Section title="Tests without AI">
        <div className="flex space-x-4">
          <button className="btn btn-primary" onClick={whiten}>whiten</button>
          <button className="btn btn-primary" onClick={darken}>darken</button>
        </div>
        <div
        ref={containerRef}
        onPointerEnter={() => {
            whiten()
        }}
        onPointerLeave={() => {
            darken()
        }}
        className="relative isolate overflow-hidden rounded-3xl p-8"
      >
        <div className="relative z-10 flex flex-col gap-3">
          <p className="max-w-2xl text-base">
            Weird innit?
          </p>
          <p className="text-base text-sm">
            Without AI this time
          </p>
        </div>
        <canvas
          ref={canvasRef}
          className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-out`}
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,120,60,0.35),transparent_38%),radial-gradient(circle_at_80%_12%,rgba(255,190,120,0.2),transparent_26%),radial-gradient(circle_at_40%_80%,rgba(255,80,40,0.2),transparent_32%)] mix-blend-screen" />
      </div>
    </Section>
    );
};