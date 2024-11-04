"use client";
import { useState, useEffect } from "react";

export function AnimatedCounter({
  value,
  duration = 200,
}: {
  value: number;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let startTime: number | undefined;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration) {
        setDisplayValue(Math.floor((value * progress) / duration));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <div className="transition-all duration-300 ease-out">
      {(displayValue || 0).toLocaleString()}
    </div>
  );
}
