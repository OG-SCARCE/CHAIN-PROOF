import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  Fingerprint,
  Workflow,
  ShieldCheck,
  FileDigit,
  Activity,
  ArrowRight,
  KeyRound,
  ScanSearch,
  AppWindow,
  ScrollText,
  LogIn,
  UserPlus,
  LogOut,
  Lock,
} from "lucide-react";
import { useEvidence } from "@/context/EvidenceContext";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS, ROLE_DESCRIPTIONS, type UserRole } from "@/context/AuthContext";
import { Metric } from "@/components/shared";
import { Waypoints, ShieldAlert } from "lucide-react";
import FaultyTerminal from "@/components/FaultyTerminal/FaultyTerminal";
import MagicBento from "@/components/MagicBento";
import LetterGlitch from "@/components/LetterGlitch";
import Globe from "@/components/Globe";
import ReflectiveCard from "@/components/ReflectiveCard/ReflectiveCard";
import TerminalTextBlock from "@/components/TerminalTextBlock";

// New Landing Page Sections
import TechStack from "@/components/TechStack";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import CurvedLoop from "@/components/CurvedLoop";

const features = [
  {
    to: "/intake",
    icon: Fingerprint,
    title: "Evidence Intake",
    description: "Capture files or transcripts, hash them in-browser with SHA-256/384/512, and generate sealed evidence records.",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
  },
  {
    to: "/transfer",
    icon: Workflow,
    title: "Custody Transfer",
    description: "Log every handoff with handlers, locations, and notes to keep the evidence chain intact and auditable.",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/20",
  },
  {
    to: "/verify",
    icon: ShieldCheck,
    title: "Integrity Verification",
    description: "Re-run digests against stored hashes and instantly flag tampered or mismatched evidence.",
    color: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/20",
  },
  {
    to: "/registry",
    icon: FileDigit,
    title: "Evidence Registry",
    description: "Search, filter, inspect, and export all evidence records with full metadata and custody timelines.",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/20",
  },
  {
    to: "/activity",
    icon: Activity,
    title: "Recent Activity",
    description: "Monitor the latest custody, transfer, and verification events across all active investigations.",
    color: "from-rose-500/20 to-pink-500/20",
    border: "border-rose-500/20",
  },
];

const principles = [
  {
    icon: KeyRound,
    title: "Tamper-Proof Sealing",
    description: "Every artifact is hashed at the moment of capture using the Web Crypto API — no server, no third party.",
    accentColor: "#34d399",
    accentRgb: "52, 211, 153",
    iconColor: "text-emerald-300",
  },
  {
    icon: ScanSearch,
    title: "Instant Verification",
    description: "Compare a fresh digest against any stored seal in seconds. Mismatches trigger immediate alerts.",
    accentColor: "#fbbf24",
    accentRgb: "251, 191, 36",
    iconColor: "text-amber-300",
  },
  {
    icon: AppWindow,
    title: "Browser-Native",
    description: "Runs entirely in your browser. Evidence data stays on your device in localStorage — zero cloud dependency.",
    accentColor: "#38bdf8",
    accentRgb: "56, 189, 248",
    iconColor: "text-sky-300",
  },
  {
    icon: ScrollText,
    title: "Audit-Ready Chain",
    description: "Every intake, transfer, and verification is logged with timestamps, actors, and locations for full traceability.",
    accentColor: "#a78bfa",
    accentRgb: "167, 139, 250",
    iconColor: "text-violet-300",
  },
];

const HackerAvatar = ({ role }: { role: UserRole }) => {
  const getAvatarColor = () => {
    switch (role) {
      case "forensic_analyst": return "#34d399"; // emerald
      case "lab_technician": return "#60a5fa"; // blue
      case "case_manager": return "#c084fc"; // purple
      case "court_officer": return "#fbbf24"; // amber
      default: return "#f87171"; // red
    }
  };

  const color = getAvatarColor();

  return (
    <div className="flex h-14 w-14 shrink-0 shadow-lg items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#0A0A0A]">
      <svg viewBox="0 0 100 100" className="h-full w-full scale-[1.15] translate-y-1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#0A0A0A" />
        <circle cx="50" cy="80" r="30" fill={color} opacity="0.25" style={{ filter: 'blur(8px)' }} />
        <path d="M50 15 C 30 15, 15 45, 10 70 L 90 70 C 85 45, 70 15, 50 15 Z" fill="#ffffff" />
        <path d="M30 40 C 30 25, 40 20, 50 20 C 60 20, 70 25, 70 40 C 70 60, 50 70, 50 70 C 50 70, 30 60, 30 40 Z" fill="#0A0A0A" />
        <path d="M15 65 L 85 65 C 87 65, 88 67, 88.5 69 L 92 100 L 8 100 L 11.5 69 C 12 67, 13 65, 15 65 Z" fill="#0A0A0A" />
        <path d="M14 65 L 86 65" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <g fill={color}>
          <path d="M44 80 C 44 76, 46 74, 50 74 C 54 74, 56 76, 56 80 C 56 83, 54 85, 50 85 C 46 85, 44 83, 44 80 Z" />
          <rect x="47" y="84" width="6" height="4" rx="0.5" />
          <circle cx="47.5" cy="80.5" r="1.2" fill="#0A0A0A" />
          <circle cx="52.5" cy="80.5" r="1.2" fill="#0A0A0A" />
          <path d="M49 83 L 51 83 L 50 84.5 Z" fill="#0A0A0A" />
          <path d="M42 88 L 58 92 M 42 92 L 58 88" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function HomePage() {
  const { summary } = useEvidence();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const bentoItems = useMemo(
    () =>
      features.map((f, i) => ({
        title: f.title,
        description: f.description,
        icon: <f.icon className="h-6 w-6" />,
        link: f.to,
        colSpan: i === 0 || i === 3 ? 2 : i === 4 ? 3 : 1,
      })),
    [],
  );

  return (
    <div className="min-h-screen">
      {/* ── hero section ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06] bg-gradient-to-b from-emerald-950/30 via-[#060a18] to-[#02050b]">
        {/* FaultyTerminal background */}
        <div className="absolute inset-0 z-0 opacity-60">
          <FaultyTerminal
            scale={1.5}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={0.5}
            pause={false}
            scanlineIntensity={0.5}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={0}
            dither={0}
            curvature={0.1}
            tint="#A7EF9E"
            mouseReact
            mouseStrength={0.5}
            pageLoadAnimation
            brightness={0.6}
          />
        </div>
        {/* gradient overlay for text readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#060a18]/70 via-[#060a18]/50 to-[#02050b]/90" />

        <div className="relative z-[2] mx-auto max-w-6xl px-6 pb-20 pt-16 sm:px-8">
          {/* Two-column hero layout */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
            {/* LEFT COLUMN — Globe + Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 text-left"
            >
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                <Globe
                  className="w-28 h-28 sm:w-36 sm:h-36 shrink-0"
                  dark={1}
                  baseColor="#34d399"
                  glowColor="#064e3b"
                  markerColor="#6ee7b7"
                  mapBrightness={8}
                  scale={1.05}
                />
                <h1 className="text-5xl font-extrabold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                  Chain<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Proof</span>
                </h1>
              </div>

              <TerminalTextBlock 
                text="Securing digital evidence with tamper-proof integrity. Capture artifacts, seal them with browser-side hashing, and preserve every handoff in one audit-ready chain."
                delay={800}
                typingSpeed={15}
              />

              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
                <Link
                  to="/intake"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-950 transition-all hover:scale-105 hover:bg-emerald-100 hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  Start Evidence Intake
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/registry"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-white/90 backdrop-blur-sm transition-all hover:border-emerald-300/40 hover:bg-white/5"
                >
                  View Registry
                </Link>
              </div>
            </motion.div>

            {/* RIGHT COLUMN — Auth card or User info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="mt-12 lg:mt-0 w-full lg:w-80 shrink-0"
            >
              <ReflectiveCard
                overlayColor="rgba(0, 0, 0, 0.2)"
                blurStrength={12}
                metalness={1}
                grayscale={0.15}
                color="#ffffff"
              >
                <div className="reflective-card-inner">
                  {isAuthenticated && user ? (
                    <>
                      {/* Header row */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.06] px-2.5 py-1">
                          <Lock size={12} className="text-white/70" />
                          <span className="text-[10px] font-semibold tracking-[0.15em] text-white/70 uppercase">Secure Access</span>
                        </div>
                        <Activity className="text-white/40" size={18} />
                      </div>

                      {/* User details to fill the space */}
                      <div className="flex-1 flex flex-col items-center justify-center gap-3 py-4">
                        <HackerAvatar role={user.role} />
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1">
                          <ShieldCheck size={12} className="text-emerald-400/70" />
                          <span className="text-[10px] font-semibold tracking-[0.12em] text-emerald-300/80 uppercase">{ROLE_LABELS[user.role]}</span>
                        </div>
                        <p className="text-[11px] leading-4 text-white/30 text-center max-w-[200px]">{ROLE_DESCRIPTIONS[user.role]}</p>
                      </div>

                      {/* User info, centered */}
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold tracking-wide text-white uppercase">{user.name}</h2>
                        <p className="mt-1 text-xs font-medium tracking-[0.2em] text-white/50 uppercase">{ROLE_LABELS[user.role]}</p>
                      </div>

                      {/* Footer row */}
                      <div className="flex items-end justify-between border-t border-white/10 pt-4">
                        <div>
                          <span className="block text-[10px] font-medium tracking-[0.1em] text-white/40 uppercase">Email</span>
                          <span className="block text-sm font-medium text-white/80 mt-0.5">{user.email}</span>
                        </div>
                        <Fingerprint size={30} className="text-white/25" />
                      </div>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-2.5 text-xs font-medium tracking-wide text-white/60 uppercase transition hover:bg-white/[0.08] hover:text-white/90"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-white">Get Started</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Log in or create an account to access all features.
                      </p>
                      <div className="mt-6 flex flex-col gap-3">
                        <Link
                          to="/login"
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
                        >
                          <LogIn className="h-4 w-4" />
                          Log In
                        </Link>
                        <Link
                          to="/register"
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition-all hover:border-emerald-300/40 hover:bg-white/5"
                        >
                          <UserPlus className="h-4 w-4" />
                          Sign Up
                        </Link>
                      </div>
                      <div className="mt-5 border-t border-white/10 pt-4">
                        <p className="text-xs text-slate-500 text-center">
                          Data stays in your browser — zero cloud dependency.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </ReflectiveCard>
            </motion.div>
          </div>

          {/* ── dashboard metrics ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] backdrop-blur-sm"
          >
            <div className="grid border-y border-white/10 md:grid-cols-2 xl:grid-cols-5">
              <Metric icon={FileDigit} label="Evidence" value={String(summary.evidence)} />
              <Metric icon={Waypoints} label="Cases" value={String(summary.cases)} />
              <Metric icon={Workflow} label="Transfers" value={String(summary.transfers)} />
              <Metric icon={ShieldCheck} label="Verified" value={String(summary.verified)} />
              <Metric icon={ShieldAlert} label="Alerts" value={String(summary.alerts)} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── how it works ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        {/* LetterGlitch background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <LetterGlitch
            glitchSpeed={80}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
            glitchColors={["#064e3b", "#34d399", "#10b981"]}
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#050814]/80 via-[#050814]/60 to-[#050814]/80" />

        <div className="relative z-[2] mx-auto max-w-6xl px-6 py-20 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-emerald-300/80">How It Works</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Every transfer leaves a cryptographic trail
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
              ChainProof turns browser-side hashing, custody transfers, and verification checkpoints into a single operating surface for digital investigations.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {principles.map((p) => (
              <motion.div
                key={p.title}
                variants={itemVariants}
                className="principle-card"
                style={{
                  "--card-accent": p.accentColor,
                  "--card-accent-rgb": p.accentRgb,
                } as React.CSSProperties}
              >
                <div className="principle-card-content">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${p.iconColor}`} style={{ background: `${p.accentColor}15`, border: `1px solid ${p.accentColor}30` }}>
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">{p.title}</h3>
                  <p className="text-sm leading-6 text-slate-400">{p.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16"
          >
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { step: "01", title: "Capture & Seal", text: "Upload files or paste transcripts. ChainProof hashes them instantly with SHA-256/384/512." },
                { step: "02", title: "Transfer & Track", text: "Every custody handoff is logged with actor, recipient, location, and timestamped notes." },
                { step: "03", title: "Verify & Alert", text: "Re-run the digest against the original seal at any point. Mismatches trigger an immediate alert." },
              ].map((s) => (
                <div
                  key={s.step}
                  className="group relative flex w-full flex-[1_1_100%] rounded-[20px] transition-all duration-300 hover:shadow-[0_0_30px_1px_rgba(0,255,117,0.30)] flex-col items-stretch"
                  style={{ backgroundImage: "linear-gradient(163deg, #00ff75 0%, #3700ff 100%)" }}
                >
                  <div className="flex h-full w-full flex-col rounded-[10px] bg-[#1a1a1a] p-8 sm:p-10 transition-all duration-200 group-hover:scale-[0.98] group-hover:rounded-[20px]">
                    <span className="text-3xl font-bold text-emerald-500/30">{s.step}</span>
                    <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── feature cards with MagicBento ── */}
      <section className="bg-gradient-to-b from-[#050814] to-[#02050b]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-emerald-300/80">Features</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Everything you need for evidence management
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Hover over each card to explore ChainProof's core capabilities. Click to dive in.
            </p>
          </motion.div>

          <MagicBento
            items={bentoItems}
            textAutoHide={true}
            enableStars
            enableSpotlight
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect
            spotlightRadius={400}
            particleCount={6}
            glowColor="52, 211, 153"
            disableAnimations={false}
          />
        </div>
      </section>

      {/* ── section divider ── */}
      <div className="bg-[#02050b]">
        <CurvedLoop
          marqueeText="SHA-256 ✦ Browser-Native ✦ Zero Cloud ✦ Tamper-Proof ✦"
          speed={1}
          curveAmount={250}
          direction="right"
          interactive
        />
      </div>

      <TechStack />

      <Pricing />
      <FAQ />

      {/* ── footer ── */}
      <Footer />
    </div>
  );
}
