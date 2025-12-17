"use client";

import { Section } from "@/components/Section";
import React from "react";


export function CrackleSection2() {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const ctx = canvasRef.current?.getContext("2d");
    
    const makesmthelsehappen = () => {
        if (!ctx) return;
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    
    const makesmthhappen = () => {
        if (!ctx) return;
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    return (
    <Section title="Tests without AI">
        <div>
        <canvas
          ref={canvasRef}
        />
        </div>
        <button className="m-5 btn btn-primary" onClick={makesmthhappen}>Make smth happen</button>
        <button className="m-5 btn btn-primary" onClick={makesmthelsehappen}>Make smth else happen</button>
    </Section>
    );
};