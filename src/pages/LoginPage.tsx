import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, ArrowRight, Mail, KeyRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Panel,
  FieldLabel,
  inputClassName,
} from "@/components/shared";
import PixelSnow from "@/components/PixelSnow";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setIsLoading(true);
    try {
      const err = await login(email.trim(), password);
      if (err) {
        setError(err);
      } else {
        navigate(from, { replace: true });
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

      <div className="relative z-10 mx-auto max-w-md px-6 py-24 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10">
            <LogIn className="h-8 w-8 text-emerald-300" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Sign in to access your evidence workspace
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
          icon={LogIn}
          title="Log In"
          description="Enter your credentials to continue."
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <FieldLabel htmlFor="login-email">Email address</FieldLabel>
              <div className="relative">
                <input
                  id="login-email"
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

            <div>
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <div className="relative">
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClassName}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <KeyRound className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 mt-1" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100 hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in…" : "Sign In"}
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
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-emerald-300 transition hover:text-emerald-200 hover:underline"
          >
            Sign up
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
