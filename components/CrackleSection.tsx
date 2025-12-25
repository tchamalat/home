"use client";

import type { PointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Section } from "@/components/Section";

type Point = { x: number; y: number };

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function CrackleSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevPointRef = useRef<Point | null>(null);
  const [visible, setVisible] = useState(false);

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

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const drawBaseCrust = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    syncCanvasSize();
    clearCanvas();

    const width = canvas.width;
    const height = canvas.height;
    const ratio = window.devicePixelRatio || 1;
    const crackCount = Math.floor(randomBetween(12, 20));

    ctx.lineWidth = 1 * ratio;
    ctx.strokeStyle = "rgba(255, 120, 60, 0.18)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 3 * ratio;

    for (let i = 0; i < crackCount; i += 1) {
      let x = randomBetween(width * 0.05, width * 0.95);
      let y = randomBetween(height * 0.05, height * 0.95);
      let angle = randomBetween(0, Math.PI * 2);
      const segmentCount = Math.floor(randomBetween(3, 6));
      const baseStep = (Math.min(width, height) * 0.1) / segmentCount;

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let s = 0; s < segmentCount; s += 1) {
        angle += randomBetween(-0.5, 0.5);
        const step = baseStep * randomBetween(0.7, 1.3);
        x += Math.cos(angle) * step;
        y += Math.sin(angle) * step;
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    }
  }, [clearCanvas, syncCanvasSize]);

  const toCanvasPoint = useCallback(
    (event: PointerEvent): Point | null => {
      const container = containerRef.current;
      if (!container) return null;
      const rect = container.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      return {
        x: (event.clientX - rect.left) * ratio,
        y: (event.clientY - rect.top) * ratio
      };
    },
    []
  );

  const drawLavaStroke = useCallback((from: Point, to: Point) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const ratio = window.devicePixelRatio || 1;
    const thickness = randomBetween(2.4, 4.4) * ratio;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = thickness;

    const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
    gradient.addColorStop(0, "#1a0b09");
    gradient.addColorStop(0.2, "#571103");
    gradient.addColorStop(0.55, "#c43a00");
    gradient.addColorStop(0.75, "#ff6a3d");
    gradient.addColorStop(1, "#ffd166");
    ctx.strokeStyle = gradient;

    ctx.shadowColor = "rgba(255, 120, 60, 0.85)";
    ctx.shadowBlur = 18 * ratio;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    const branchCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < branchCount; i += 1) {
      const t = Math.random();
      const bx = from.x + (to.x - from.x) * t;
      const by = from.y + (to.y - from.y) * t;
      const branchAngle = Math.atan2(to.y - from.y, to.x - from.x) + randomBetween(-1.2, 1.2);
      const branchLen = randomBetween(10, 26) * ratio;

      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(branchAngle) * branchLen, by + Math.sin(branchAngle) * branchLen);
      ctx.stroke();
    }

    ctx.restore();
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!visible) return;
      const nextPoint = toCanvasPoint(event);
      if (!nextPoint) return;

      const lastPoint = prevPointRef.current ?? nextPoint;
      drawLavaStroke(lastPoint, nextPoint);
      prevPointRef.current = nextPoint;
    },
    [drawLavaStroke, toCanvasPoint, visible]
  );

  useEffect(() => {
    const handleResize = () => {
      syncCanvasSize();
      drawBaseCrust();
      prevPointRef.current = null;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawBaseCrust, syncCanvasSize]);

  return (
    <Section title="Test with AI" className="relative overflow-hidden">
      <div
        ref={containerRef}
        onPointerEnter={() => {
          setVisible(true);
          prevPointRef.current = null;
          drawBaseCrust();
        }}
        onPointerLeave={() => {
          setVisible(false);
          prevPointRef.current = null;
        }}
        onPointerMove={handlePointerMove}
        className="relative isolate overflow-hidden rounded-3xl border border-orange-900/30 from-neutral-950 via-neutral-900 to-neutral-950 p-8 shadow-inner"
      >
        <div className="relative z-10 flex flex-col gap-3">
          <p className="max-w-2xl text-base">
            Weird innit?
          </p>
          <p className="text-sm text-base">
            full AI but not ugly
          </p>
        </div>
        <canvas
          ref={canvasRef}
          className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-out ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,120,60,0.35),transparent_38%),radial-gradient(circle_at_80%_12%,rgba(255,190,120,0.2),transparent_26%),radial-gradient(circle_at_40%_80%,rgba(255,80,40,0.2),transparent_32%)] mix-blend-screen" />
      </div>
    </Section>
  );
}


