import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TerminalTextBlockProps {
  text: string;
  delay?: number;
  typingSpeed?: number;
}

export default function TerminalTextBlock({
  text,
  delay = 50,
  typingSpeed = 280,
}: TerminalTextBlockProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    // Start initial delay
    timeout = setTimeout(() => {
      setHasStarted(true);
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        // Calculate a dynamic chunk size based on text length to ensure it finishes very quickly (e.g., ~20-30 ticks total)
        const chunkSize = Math.max(3, Math.floor(text.length / 25));
        
        // Add multiple characters at a time for a blazing fast, smooth "terminal spew" effect
        setDisplayedText(text.slice(0, displayedText.length + chunkSize));
      }, typingSpeed); // extremely fast interval

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [displayedText, text, hasStarted, typingSpeed]);

  return (
    <div className="relative mt-8 max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-[#0A0A0A]/60 shadow-[0_0_40px_rgba(16,185,129,0.2)] backdrop-blur-md"
      >
        {/* Terminal Header */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
            <div className="h-3 w-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
            <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
          </div>
          <div className="mx-auto flex transform items-center text-[10px] font-medium uppercase tracking-widest text-slate-500">
            <span className="mr-2">bash</span> — root@chainproof:~
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-5 font-mono text-sm leading-relaxed text-emerald-400 sm:text-[15px] sm:leading-7">
          <div className="min-h-[100px]">
            <span className="text-emerald-500/50 mr-2">$&gt;</span>
            <span className="text-slate-300">{displayedText}</span>
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="ml-1 inline-block h-[15px] w-[8px] bg-emerald-400 align-middle"
              />
            )}
            {!isTyping && (
              <span className="ml-1 inline-block h-[15px] w-[8px] bg-emerald-400/50 align-middle" />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
