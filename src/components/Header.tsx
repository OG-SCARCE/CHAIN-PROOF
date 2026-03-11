import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Fingerprint,
  Workflow,
  ShieldCheck,
  FileDigit,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";

const navItems = [
  { to: "/", icon: Home, label: "Home", end: true },
  { to: "/intake", icon: Fingerprint, label: "Evidence Intake" },
  { to: "/transfer", icon: Workflow, label: "Custody Transfer" },
  { to: "/verify", icon: ShieldCheck, label: "Verification" },
  { to: "/registry", icon: FileDigit, label: "Evidence Registry" },
  { to: "/activity", icon: Activity, label: "Recent Activity" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 pointer-events-none",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pointer-events-auto">
        <div 
          className={cn(
            "flex h-16 items-center justify-between rounded-2xl border transition-all duration-300",
            scrolled 
              ? "bg-[#060a18]/80 border-white/10 shadow-lg shadow-black/20 backdrop-blur-xl px-4" 
              : "bg-transparent border-transparent px-2"
          )}
        >
          {/* Brand/Logo */}
          <NavLink to="/" className="flex items-center gap-3 shrink-0 group">
            <span className="text-lg font-bold tracking-tight text-white">
              Chain<span className="text-emerald-400">Proof</span>
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center space-x-1">
            {navItems.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-emerald-300"
                      : "text-slate-400 hover:text-white"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn(
                      "relative z-10 h-[18px] w-[18px] transition-colors",
                      isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                    )} />
                    <span className="relative z-10">{label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="headerActiveNav"
                        className="absolute inset-0 rounded-lg bg-emerald-500/10 border border-emerald-400/20"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 backdrop-blur-lg transition hover:border-emerald-300/30 hover:bg-white/10 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm pointer-events-auto lg:hidden"
            />
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-x-4 top-4 z-50 rounded-3xl border border-white/10 bg-[#060a18]/95 p-6 shadow-2xl backdrop-blur-2xl pointer-events-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-white">
                    Chain<span className="text-emerald-400">Proof</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col space-y-2">
                {navItems.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-200",
                        isActive
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                          : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={cn(
                          "h-5 w-5 transition-colors",
                          isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                        )} />
                        <span>{label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
              
              {/* Mobile Footer */}
              <div className="mt-8 border-t border-white/10 pt-6 text-center">
                <p className="text-xs text-slate-500">v0.2.0 · ChainProof</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
