import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldX } from "lucide-react";
import PixelSnow from "@/components/PixelSnow";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/context/AuthContext";

export default function UnauthorizedPage() {
  const { user } = useAuth();

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

      <div className="relative z-10 mx-auto max-w-md px-6 py-32 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10">
            <ShieldX className="h-8 w-8 text-rose-400" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Access Denied</h1>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Your role{user ? ` (${ROLE_LABELS[user.role]})` : ""} does not have permission to access this page.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
