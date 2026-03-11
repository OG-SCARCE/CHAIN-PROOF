import { useEffect, useRef, useCallback, type ReactNode } from "react";
import gsap from "gsap";

/* ── types ── */
type BentoItem = {
  title: string;
  description: string;
  icon?: ReactNode;
  colSpan?: number;
  rowSpan?: number;
  link?: string;
  children?: ReactNode;
};

type MagicBentoProps = {
  items: BentoItem[];
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
  disableAnimations?: boolean;
};

/* ── star particle ── */
function spawnStars(container: HTMLElement, count: number): HTMLDivElement[] {
  const stars: HTMLDivElement[] = [];
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "magic-star";
    star.style.cssText = `
      position:absolute;
      width:${2 + Math.random() * 3}px;
      height:${2 + Math.random() * 3}px;
      background:rgba(255,255,255,${0.3 + Math.random() * 0.5});
      border-radius:50%;
      pointer-events:none;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      z-index:1;
    `;
    container.appendChild(star);
    stars.push(star);

    gsap.to(star, {
      opacity: 0,
      duration: 1.5 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 3,
      ease: "sine.inOut",
    });

    gsap.to(star, {
      y: -10 + Math.random() * 20,
      x: -10 + Math.random() * 20,
      duration: 3 + Math.random() * 4,
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 2,
      ease: "sine.inOut",
    });
  }
  return stars;
}

/* ── click ripple ── */
function createRipple(e: MouseEvent, card: HTMLElement, glowColor: string) {
  const rect = card.getBoundingClientRect();
  const ripple = document.createElement("div");
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ripple.style.cssText = `
    position:absolute;
    left:${x}px;
    top:${y}px;
    width:0;
    height:0;
    border-radius:50%;
    background:radial-gradient(circle, rgba(${glowColor},0.35), transparent 70%);
    transform:translate(-50%,-50%);
    pointer-events:none;
    z-index:5;
  `;
  card.appendChild(ripple);

  gsap.to(ripple, {
    width: 300,
    height: 300,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out",
    onComplete: () => ripple.remove(),
  });
}

/* ── BentoCard ── */
function BentoCard({
  item,
  glowColor,
  enableSpotlight,
  enableBorderGlow,
  enableTilt,
  enableMagnetism,
  enableStars,
  clickEffect,
  spotlightRadius,
  particleCount,
  textAutoHide,
  disableAnimations,
}: {
  item: BentoItem;
  glowColor: string;
  enableSpotlight: boolean;
  enableBorderGlow: boolean;
  enableTilt: boolean;
  enableMagnetism: boolean;
  enableStars: boolean;
  clickEffect: boolean;
  spotlightRadius: number;
  particleCount: number;
  textAutoHide: boolean;
  disableAnimations: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const borderOverlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement[]>([]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const card = cardRef.current;
      if (!card || disableAnimations) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // spotlight
      if (enableSpotlight && spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(${spotlightRadius}px circle at ${x}px ${y}px, rgba(${glowColor},0.12), transparent 60%)`;
      }

      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // border glow
      if (enableBorderGlow && borderOverlayRef.current) {
        const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
        borderOverlayRef.current.style.background = `linear-gradient(${angle + 90}deg, rgba(${glowColor},0.6), rgba(${glowColor},0.05) 50%, rgba(${glowColor},0.6))`;
      }

      // tilt
      if (enableTilt) {
        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) * 6;
        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.4,
          ease: "power2.out",
          transformPerspective: 800,
        });
      }

      // magnetism on content
      if (enableMagnetism && contentRef.current) {
        gsap.to(contentRef.current, {
          x: ((x - cx) / cx) * 6,
          y: ((y - cy) / cy) * 6,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    },
    [enableSpotlight, enableBorderGlow, enableTilt, enableMagnetism, glowColor, spotlightRadius, disableAnimations],
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card || disableAnimations) return;

    if (enableSpotlight && spotlightRef.current) {
      spotlightRef.current.style.background = "transparent";
    }
    if (enableBorderGlow && borderOverlayRef.current) {
      borderOverlayRef.current.style.background = "transparent";
    }
    if (enableTilt) {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
    }
    if (enableMagnetism && contentRef.current) {
      gsap.to(contentRef.current, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
    }
  }, [enableSpotlight, enableBorderGlow, enableTilt, enableMagnetism, disableAnimations]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (clickEffect && cardRef.current && !disableAnimations) {
        createRipple(e, cardRef.current, glowColor);
      }
    },
    [clickEffect, glowColor, disableAnimations],
  );

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // entrance animation
    if (!disableAnimations) {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: undefined,
        },
      );
    }

    // stars
    if (enableStars && !disableAnimations) {
      starsRef.current = spawnStars(card, particleCount);
    }

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("click", handleClick);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
      card.removeEventListener("click", handleClick);
      // Kill all GSAP tweens on star elements to prevent infinite tween stacking
      starsRef.current.forEach((star) => {
        gsap.killTweensOf(star);
        star.remove();
      });
      starsRef.current = [];
    };
  }, [handleMouseMove, handleMouseLeave, handleClick, enableStars, particleCount, disableAnimations]);

  const Wrapper = item.link ? "a" : "div";
  const wrapperProps = item.link ? { href: item.link } : {};

  return (
    <Wrapper
      {...(wrapperProps as any)}
      ref={cardRef as any}
      className={`group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm transition-colors duration-300 hover:border-white/[0.15] hover:bg-white/[0.04] ${
        item.colSpan === 3 ? "md:col-span-3" : item.colSpan === 2 ? "md:col-span-2" : ""
      } ${item.rowSpan === 2 ? "md:row-span-2" : ""}`}
      style={{
        transformStyle: enableTilt ? "preserve-3d" : undefined,
      }}
    >
      {/* spotlight overlay */}
      {enableSpotlight && (
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute inset-0 z-[2] rounded-[24px] transition-opacity duration-300"
        />
      )}

      {/* border glow overlay (uses mask to create curved 1px border) */}
      {enableBorderGlow && (
        <div
          ref={borderOverlayRef}
          className="pointer-events-none absolute inset-0 z-[1] rounded-[24px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            padding: "1px",
            // This masks everything except a 1px ring hugging the rounded corner border curve
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      )}

      {/* content */}
      <div ref={contentRef} className="relative z-[3] flex h-full flex-col p-6 sm:p-7">
        {item.icon && (
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white transition group-hover:bg-white/10 group-hover:shadow-lg"
            style={{ boxShadow: `0 0 20px rgba(${glowColor},0.1)` }}
          >
            {item.icon}
          </div>
        )}

        {item.children && <div className="mb-4 flex-1">{item.children}</div>}

        <div className={textAutoHide ? "transition-opacity duration-300 group-hover:opacity-100 sm:opacity-0" : ""}>
          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
        </div>

        {item.link && (
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Explore →
          </div>
        )}
      </div>
    </Wrapper>
  );
}

/* ── MagicBento ── */
export default function MagicBento({
  items,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = true,
  spotlightRadius = 400,
  particleCount = 6,
  glowColor = "52, 211, 153",
  disableAnimations = false,
}: MagicBentoProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item, i) => (
        <BentoCard
          key={i}
          item={item}
          glowColor={glowColor}
          enableSpotlight={enableSpotlight}
          enableBorderGlow={enableBorderGlow}
          enableTilt={enableTilt}
          enableMagnetism={enableMagnetism}
          enableStars={enableStars}
          clickEffect={clickEffect}
          spotlightRadius={spotlightRadius}
          particleCount={particleCount}
          textAutoHide={textAutoHide}
          disableAnimations={disableAnimations}
        />
      ))}
    </div>
  );
}
