import React from "react";

const Particle = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <span
    className={`particle absolute w-3 h-3 rounded-full bg-base-content pointer-events-none ${className}`}
    style={style}
    />
);

export default Particle;
