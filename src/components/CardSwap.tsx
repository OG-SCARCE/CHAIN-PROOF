import {
  useState,
  useEffect,
  useRef,
  Children,
  type ReactNode,
  type CSSProperties,
} from "react";

/* ── Card wrapper ── */
export function Card({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

/* ── CardSwap ── */
type CardSwapProps = {
  children: ReactNode;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
};

export default function CardSwap({
  children,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
}: CardSwapProps) {
  const cards = Children.toArray(children);
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const isPaused = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const rotateCards = () => {
    setOrder((prev) => {
      const next = [...prev];
      const first = next.shift()!;
      next.push(first);
      return next;
    });
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isPaused.current) rotateCards();
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [delay]);

  const handleMouseEnter = () => {
    if (pauseOnHover) isPaused.current = true;
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) isPaused.current = false;
  };

  const total = cards.length;

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {order.map((cardIndex, stackPosition) => {
        const isTop = stackPosition === 0;
        const depth = stackPosition;

        const xOffset = depth * cardDistance;
        const yOffset = depth * verticalDistance;
        const scale = 1 - depth * 0.04;
        const zIndex = total - depth;
        const opacity = 1 - depth * 0.15;

        return (
          <div
            key={cardIndex}
            onClick={isTop ? rotateCards : undefined}
            className="absolute left-1/2 top-1/2 w-full max-w-md"
            style={{
              transform: `translate(-50%, -50%) translateX(${xOffset}px) translateY(${yOffset}px) scale(${scale})`,
              zIndex,
              opacity,
              cursor: isTop ? "pointer" : "default",
              transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {cards[cardIndex]}
          </div>
        );
      })}
    </div>
  );
}
