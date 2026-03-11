"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, FileLock2 } from "lucide-react";
import { cn } from "@/utils/cn";

type CyberMatrixHeroProps = {
  badge?: string;
  brand: string;
  title: string;
  tagline: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  backgroundImage?: string;
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.18 + 0.35,
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function CyberMatrixHero({
  badge = "Digital Forensics Chain of Custody",
  brand,
  title,
  tagline,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  backgroundImage,
}: CyberMatrixHeroProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !gridRef.current) {
      return;
    }

    const grid = gridRef.current;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/?;:"[]{}\\|!@#$%^&*()_+-=';
    let animationFrame = 0;

    const createTile = () => {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.onclick = (event) => {
        const target = event.currentTarget as HTMLDivElement;
        target.textContent = chars[Math.floor(Math.random() * chars.length)] ?? "#";
        target.classList.add("glitch");
        window.setTimeout(() => target.classList.remove("glitch"), 200);
      };
      return tile;
    };

    const createGrid = () => {
      grid.innerHTML = "";

      const size = window.innerWidth < 768 ? 46 : 58;
      const columns = Math.floor(window.innerWidth / size);
      const rows = Math.floor(window.innerHeight / size);

      grid.style.setProperty("--columns", String(columns));
      grid.style.setProperty("--rows", String(rows));

      Array.from({ length: columns * rows }, () => createTile()).forEach((tile) => {
        tile.textContent = chars[Math.floor(Math.random() * chars.length)] ?? "#";
        grid.appendChild(tile);
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        const radius = window.innerWidth / 4;

        Array.from(grid.children).forEach((tile) => {
          const element = tile as HTMLDivElement;
          const rect = element.getBoundingClientRect();
          const tileX = rect.left + rect.width / 2;
          const tileY = rect.top + rect.height / 2;
          const distance = Math.hypot(event.clientX - tileX, event.clientY - tileY);
          const intensity = Math.max(0, 1 - distance / radius);

          element.style.setProperty("--intensity", intensity.toFixed(3));
        });
      });
    };

    window.addEventListener("resize", createGrid);
    window.addEventListener("mousemove", handleMouseMove);
    createGrid();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener("resize", createGrid);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isClient]);

  return (
    <section className="relative isolate flex min-h-screen w-full items-center overflow-hidden bg-black">
      {backgroundImage ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : null}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.22),transparent_40%),linear-gradient(180deg,rgba(2,6,23,0.12),rgba(0,0,0,0.88))]" />
      <div ref={gridRef} id="tiles" className="absolute inset-0" />

      <style>{`
        #tiles {
          --intensity: 0;
          display: grid;
          grid-template-columns: repeat(var(--columns), 1fr);
          grid-template-rows: repeat(var(--rows), 1fr);
          width: 100vw;
          height: 100vh;
        }
        .tile {
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Courier New", Courier, monospace;
          font-size: 1rem;
          opacity: calc(0.08 + var(--intensity) * 0.92);
          color: hsl(140, 100%, calc(38% + var(--intensity) * 30%));
          text-shadow: 0 0 calc(var(--intensity) * 18px) hsl(145, 88%, 56%);
          transform: scale(calc(1 + var(--intensity) * 0.16));
          transition: color 0.18s ease, text-shadow 0.18s ease, transform 0.18s ease;
          user-select: none;
        }
        .tile.glitch {
          animation: glitch-anim 0.2s ease;
        }
        @keyframes glitch-anim {
          0% { transform: scale(1); color: #22c55e; }
          50% { transform: scale(1.18); color: #f8fafc; text-shadow: 0 0 12px #f8fafc; }
          100% { transform: scale(1); color: #22c55e; }
        }
      `}</style>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-100 backdrop-blur-md"
          >
            <FileLock2 className="h-4 w-4 text-emerald-300" />
            <span>{badge}</span>
          </motion.div>

          <motion.p
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mt-8 text-sm font-semibold uppercase tracking-[0.48em] text-emerald-300/80"
          >
            {title}
          </motion.p>

          <motion.h1
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mt-4 text-5xl font-semibold tracking-[-0.08em] text-white sm:text-7xl lg:text-[7.5rem]"
          >
            {brand}
          </motion.h1>

          <motion.p
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl"
          >
            {tagline}
          </motion.p>

          <motion.div
            custom={4}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <button
              type="button"
              onClick={onPrimaryAction}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100"
            >
              {primaryActionLabel}
              <ArrowRight className="h-4 w-4" />
            </button>

            {secondaryActionLabel ? (
              <button
                type="button"
                onClick={onSecondaryAction}
                className={cn(
                  "inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white/90 backdrop-blur-sm transition",
                  "hover:border-emerald-300/40 hover:bg-white/5",
                )}
              >
                {secondaryActionLabel}
              </button>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}