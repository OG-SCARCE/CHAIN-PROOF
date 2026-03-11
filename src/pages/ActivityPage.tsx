import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useEvidence } from "@/context/EvidenceContext";
import { PageHeader, formatDate, getIntegrityTone } from "@/components/shared";
import PixelSnow from "@/components/PixelSnow";

export default function ActivityPage() {
  const { recentActivity } = useEvidence();

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
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-12 sm:px-8">
        <PageHeader
          icon={Activity}
          title="Recent Activity"
          subtitle="Latest custody, transfer, and verification events across all active investigations."
        />

        <div className="space-y-4">
          {recentActivity.length ? (
            recentActivity.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="rounded-[22px] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm transition hover:border-white/15 hover:bg-white/[0.03]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-300/10 text-xs font-bold text-emerald-300">
                        {entry.kind.charAt(0)}
                      </span>
                      <div>
                        <p className="font-medium text-white">{entry.kind} · {entry.evidenceTitle}</p>
                        <p className="mt-1 text-sm text-slate-400">{entry.evidenceId}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">
                      {entry.actor} <span className="text-slate-500">→</span> {entry.recipient}
                    </p>
                    {entry.notes && (
                      <p className="mt-2 text-sm leading-6 text-slate-500">{entry.notes}</p>
                    )}
                  </div>
                  <div className="text-sm text-slate-400 sm:text-right">
                    <p>{formatDate(entry.timestamp)}</p>
                    <p className={`mt-1 text-xs font-semibold uppercase tracking-[0.18em] ${getIntegrityTone(entry.integrity as any)}`}>
                      {entry.integrity}
                    </p>
                    <p className="mt-1 text-slate-500">{entry.location}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[24px] border border-dashed border-white/10 px-5 py-16 text-center"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <Activity className="h-6 w-6 text-slate-500" />
              </div>
              <p className="mt-5 text-lg font-medium text-white">No activity yet</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Activity appears here as soon as you create, transfer, or verify evidence.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
