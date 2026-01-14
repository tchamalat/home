'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Main({
  children,
  className,
  title,
  isGsaped = false
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  title?: string;
  isGsaped?: boolean;
}>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !isGsaped) return;

    const sections = containerRef.current.querySelectorAll('.section-item');

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { 
          opacity: 0.1,
          y: 100,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 100%',
            end: 'top 60%',
            scrub: 0.2,
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [children, isGsaped]);

  const childrenArray = Array.isArray(children) ? children : [children];

  if (!isGsaped) {
    return (
      <main className={`flex flex-col space-y-6 pt-20 ${className || ''}`}>
        {title && 
          <div className="flex justify-center">
            <h1 className={`p-4 w-fit text-4xl font-bold bg-primary/10 rounded-full ${className || ''}`}>
              {title}
            </h1>
          </div>
        }
        {children}
      </main>
    );
  }

  return (
    <main 
      className={`pt-20 ${className || ''}`}
      ref={containerRef}
    >
      {title && (
        <div className="flex justify-center mb-16">
          <h1 className={`p-4 w-fit text-4xl font-bold bg-primary/10 rounded-full ${className || ''}`}>
            {title}
          </h1>
        </div>
      )}
      
      <div className="px-4 lg:px-12 max-w-450 mx-auto">
        {childrenArray.map((child, index) => {
          const isLeft = index % 2 === 0;
          
          return (
            <div
              key={index}
              className="section-item w-full max-w-[55%] first:mt-0 mt-20"
              style={{
                marginLeft: isLeft ? '0' : 'auto',
                marginRight: isLeft ? 'auto' : '0',
              }}
            >
              <div className="w-full lg:w-auto">
                {child}
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-0"></div>
    </main>
  );
}