import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, ArrowRight, Mail, KeyRound, User, Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS, ROLE_DESCRIPTIONS, type UserRole } from "@/context/AuthContext";
import {
  Panel,
  FieldLabel,
  inputClassName,
} from "@/components/shared";
import PixelSnow from "@/components/PixelSnow";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ROLES = Object.entries(ROLE_LABELS) as [UserRole, string][];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("forensic_analyst");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Name is required."); return; }
    if (!email.trim()) { setError("Email is required."); return; }
    if (!password) { setError("Password is required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    setIsLoading(true);
    try {
      const err = await register(name.trim(), email.trim(), password, role);
      if (err) {
        setError(err);
      } else {
        navigate("/", { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#060a18] to-[#02050b]">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <PixelSnow
          color="#ecfdf5"
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={200}
          speed={1.25}
          density={0.15}
          direction={125}
          brightness={1}
          depthFade={8}
          farPlane={14}
          gamma={0.4545}
          variant="square"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-lg px-6 py-24 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10">
            <UserPlus className="h-8 w-8 text-emerald-300" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Create account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Join ChainProof to start securing your digital evidence
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
          >
            {error}
          </motion.div>
        )}

        <Panel
          icon={UserPlus}
          title="Sign Up"
          description="Fill in your details and select your role."
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="reg-name">Full name</FieldLabel>
                <div className="relative">
                  <input
                    id="reg-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClassName}
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                  <User className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 mt-1" />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="reg-email">Email address</FieldLabel>
                <div className="relative">
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClassName}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  <Mail className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 mt-1" />
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="reg-password">Password</FieldLabel>
                <div className="relative">
                  <input
                    id="reg-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClassName}
                    placeholder="Min 6 characters"
                    autoComplete="new-password"
                  />
                  <KeyRound className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 mt-1" />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="reg-confirm">Confirm password</FieldLabel>
                <div className="relative">
                  <input
                    id="reg-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClassName}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                  />
                  <KeyRound className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 mt-1" />
                </div>
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-slate-200">Select your role</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {ROLES.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-left transition-all duration-200",
                      role === value
                        ? "border-emerald-300/40 bg-emerald-300/10 shadow-sm shadow-emerald-500/10"
                        : "border-white/10 bg-slate-950/40 hover:border-white/20"
                    )}
                  >
                    <span className={cn(
                      "block text-sm font-medium",
                      role === value ? "text-emerald-200" : "text-slate-300"
                    )}>
                      {label}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500 leading-snug">
                      {ROLE_DESCRIPTIONS[value]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100 hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating account…" : "Create Account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </Panel>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-slate-400"
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-emerald-300 transition hover:text-emerald-200 hover:underline"
          >
            Log in
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
