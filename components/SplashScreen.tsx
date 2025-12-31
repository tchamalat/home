"use client";

import { useEffect, useState } from "react";

type Props = {
  welcomeText: string;
};

export default function SplashScreen({ welcomeText }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-100 flex items-center justify-center bg-fixed bg-[radial-gradient(circle_at_20%_20%,rgba(255,120,60,0.35),transparent_38%),radial-gradient(circle_at_80%_12%,rgba(255,190,120,0.2),transparent_26%),radial-gradient(circle_at_40%_80%,rgba(255,80,40,0.2),transparent_32%)] bg-base-300 ${
        isFadingOut ? "animate-fade-out-scale" : "animate-fade-in-scale"
      }`}>
      <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-base-content px-4 text-center">
        {welcomeText}
      </h1>
    </div>
  );
}
