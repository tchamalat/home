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
    <div className={`fixed inset-0 z-100 flex items-center justify-center bg-fixed bg-linear-to-br from-primary/20 via-base-300/80 to-base-100/60 ${
        isFadingOut ? "animate-fade-out-scale" : "animate-fade-in-scale"
      }`}>
      <h1 className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-base-content px-4 text-center">
        {welcomeText}
      </h1>
    </div>
  );
}
