"use client";

import Link from "next/link";
import React, { JSX, useRef } from "react";
import gsap from "gsap";
import Particle from "./Particle";
import { useRouter } from "next/navigation";

export function Button({
    title,
    link,
    alink,
    particleEffect = false,
}: Readonly<{
    title: string;
    link?: string;
    alink?: string;
    particleEffect?: boolean;
}>) {
    const router = useRouter();
    const btnRef = useRef<HTMLDivElement>(null);
    // Permet plusieurs groupes de particules simultanés
    const [particlesGroups, setParticlesGroups] = React.useState<JSX.Element[][]>([]);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        if (!particleEffect) return;
        e.preventDefault();
        let delay = 0;
        if (particleEffect) {
            const count = 18;
            const mouseX = e.pageX;
            const mouseY = e.pageY;
            const newParticles: JSX.Element[] = [];
            const groupId = Date.now() + Math.random();
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2;
                const x = mouseX + Math.cos(angle) * 10;
                const y = mouseY + Math.sin(angle) * 10;
                newParticles.push(
                    <Particle
                        key={groupId + "-" + i}
                        className={``}
                        style={{ left: x, top: y }}
                    />
                );
            }
            setParticlesGroups(prev => [...prev, newParticles]);
            setTimeout(() => {
                const allParticles = document.querySelectorAll('.particle');
                const groupParticles = Array.from(allParticles).slice(-count);
                groupParticles.forEach((el, i) => {
                    const angle = (i / count) * Math.PI * 2;
                    const dx = Math.cos(angle) * 60;
                    const dy = Math.sin(angle) * 60;
                    gsap.to(el, {
                        x: dx,
                        y: dy,
                        opacity: 0,
                        duration: 0.7,
                        ease: "power2.out",
                        onComplete: () => {
                            if (i === count - 1) {
                                setParticlesGroups(prev => prev.filter(g => g !== newParticles));
                            }
                        },
                    });
                });
            }, 10);
            delay = 700;
        }
        setTimeout(() => {
            if (link) router.push(link);
            if (alink) window.location.href = alink;
        }, delay);
    };

    return (
        <div ref={btnRef} className="">
            {link && !alink && (
                <a
                    href={link}
                    onClick={handleClick}
                    className="px-6 py-2 rounded-full hover:bg-primary/20 bg-secondary/20 transition-colors font-semioold shadow-lg duration-200 cursor-pointer select-none"
                    role="link"
                >
                    {title}
                </a>
            )}
            {alink && !link && (
                <a
                    href={alink}
                    onClick={particleEffect ? handleClick : undefined}
                    className="px-6 py-2 rounded-full hover:bg-primary/20 bg-secondary/20 transition-colors font-semioold shadow-lg duration-200 cursor-pointer select-none"
                >
                    {title}
                </a>
            )}
            {!link && !alink && (
                <a
                    onClick={particleEffect ? handleClick : undefined}
                    className="px-6 py-2 rounded-full hover:bg-primary/20 bg-secondary/20 transition-colors font-semioold shadow-lg duration-200 cursor-pointer select-none"
                >
                    {title}
                </a>
            )}
            <div className="absolute left-0 top-0 w-full h-full pointer-events-none z-10">
                {particlesGroups.flat()}
            </div>
        </div>
    );
}