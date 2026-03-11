import { useRef, useEffect, useState } from "react";

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
  className?: string;
}

export default function CurvedLoop({
  marqueeText = "ChainProof ✦ Tamper-Proof Digital Evidence ✦",
  speed = 1,
  curveAmount = 300,
  direction = "left",
  interactive = false,
  className = "",
}: CurvedLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const animRef = useRef<number>(0);

  const repeatedText = `${marqueeText}   `.repeat(40);
  const totalWidth = 3000;

  useEffect(() => {
    const step = () => {
      setOffset((prev) => {
        const next = direction === "left" ? prev - speed * 0.5 : prev + speed * 1.5;
        // Text is long enough to cover a massive distance, no need for arbitrary jump resetting
        if (Math.abs(next) > 50000) return 0;
        return next;
      });
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [speed, direction, totalWidth]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relY = (e.clientY - rect.top) / rect.height;
    setMouseY((relY - 0.5) * 100);
  };

  const curve = interactive ? curveAmount + mouseY * 2 : curveAmount;

  // Shift the curve down significantly to match "bring the animation a bit down"
  const pathD = `M -${totalWidth},160 Q 0,${160 + curve / 3} ${totalWidth / 2},160 Q ${totalWidth},${160 - curve / 3} ${totalWidth * 2},160`;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ height: "240px" }} // Increased to accommodate the severe drop
      onMouseMove={handleMouseMove}
    >
      <svg
        viewBox={`0 0 ${totalWidth} 300`} // Adjusted viewBox for more vertical room
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          <path id="curvePath" d={pathD} fill="none" />
        </defs>
        <text
          className="curved-loop-text"
          style={{
            fontSize: "64px", // Even bolder and larger font as requested!
            fontWeight: 900,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {/* A single continuous text path prevents overlapping glitches */}
          <textPath
            href="#curvePath"
            startOffset={`${offset}px`}
            fill="url(#curvedGradient)"
          >
            {repeatedText}
          </textPath>
        </text>
        <defs>
          <linearGradient id="curvedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {/* Smooth fade-in from the left edge */}
            <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
            <stop offset="10%" stopColor="#34d399" stopOpacity="0" />
            <stop offset="30%" stopColor="#34d399" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
