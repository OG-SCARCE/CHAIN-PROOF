import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

/* ── types ── */
export type HashAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";
export type CaptureMode = "file" | "text";
export type EvidenceStatus = "sealed" | "in_transfer" | "verified" | "alert";
export type IntegrityResult = "captured" | "match" | "mismatch";

export type CustodyEvent = {
  id: string;
  kind: "Intake" | "Transfer" | "Verification";
  actor: string;
  recipient: string;
  location: string;
  timestamp: string;
  notes: string;
  integrity: IntegrityResult;
};

export type EvidenceRecord = {
  id: string;
  caseId: string;
  title: string;
  ownerAgency: string;
  evidenceType: string;
  sourceMode: CaptureMode;
  description: string;
  fileName?: string;
  fileSize?: number;
  textLength?: number;
  algorithm: HashAlgorithm;
  digest: string;
  createdAt: string;
  collectedBy: string;
  currentCustodian: string;
  sceneLocation: string;
  sealCode: string;
  status: EvidenceStatus;
  lastVerifiedAt?: string;
  lastVerificationResult?: Exclude<IntegrityResult, "captured">;
  chain: CustodyEvent[];
};

export type IntakeFormState = {
  caseReference: string;
  title: string;
  ownerAgency: string;
  evidenceType: string;
  collectedBy: string;
  sceneLocation: string;
  description: string;
  algorithm: HashAlgorithm;
  sourceMode: CaptureMode;
  sourceText: string;
  sourceFile: File | null;
};

export type TransferFormState = {
  evidenceId: string;
  actor: string;
  recipient: string;
  location: string;
  notes: string;
};

export type VerifyFormState = {
  evidenceId: string;
  verifiedBy: string;
  location: string;
  sourceText: string;
  sourceFile: File | null;
};

export type VerificationOutcome = {
  evidenceId: string;
  timestamp: string;
  candidateDigest: string;
  matched: boolean;
};

/* ── constants ── */
export const STORAGE_KEY = "chainproof-evidence-registry";
export const HASH_OPTIONS: HashAlgorithm[] = ["SHA-256", "SHA-384", "SHA-512"];

export const initialIntakeState = (): IntakeFormState => ({
  caseReference: "",
  title: "",
  ownerAgency: "",
  evidenceType: "",
  collectedBy: "",
  sceneLocation: "",
  description: "",
  algorithm: "SHA-256",
  sourceMode: "file",
  sourceText: "",
  sourceFile: null,
});

export const initialTransferState = (): TransferFormState => ({
  evidenceId: "",
  actor: "",
  recipient: "",
  location: "",
  notes: "",
});

export const initialVerifyState = (): VerifyFormState => ({
  evidenceId: "",
  verifiedBy: "",
  location: "",
  sourceText: "",
  sourceFile: null,
});

/* ── utility functions ── */
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function createReference(prefix: string) {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const randomSeed = crypto.getRandomValues(new Uint32Array(1))[0] ?? Date.now();
  const suffix = randomSeed.toString(36).toUpperCase().slice(0, 6);
  return `${prefix}-${stamp}-${suffix}`;
}

export async function digestSource(algorithm: HashAlgorithm, source: ArrayBuffer) {
  const hashBuffer = await crypto.subtle.digest(algorithm, source);
  return Array.from(new Uint8Array(hashBuffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function formatBytes(value?: number) {
  if (value === undefined) return "Text capture";
  if (value < 1024) return `${value} B`;
  const units = ["KB", "MB", "GB"];
  let size = value / 1024;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function shortHash(value: string) {
  return `${value.slice(0, 14)}...${value.slice(-10)}`;
}

export function getStatusLabel(status: EvidenceStatus) {
  switch (status) {
    case "sealed": return "Sealed";
    case "in_transfer": return "In transfer";
    case "verified": return "Verified";
    case "alert": return "Alert";
    default: return status;
  }
}

export function getStatusTone(status: EvidenceStatus) {
  switch (status) {
    case "verified": return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
    case "alert": return "border-rose-400/30 bg-rose-400/10 text-rose-200";
    case "in_transfer": return "border-amber-400/30 bg-amber-400/10 text-amber-200";
    default: return "border-cyan-400/30 bg-cyan-400/10 text-cyan-200";
  }
}

export function getIntegrityTone(integrity: IntegrityResult) {
  switch (integrity) {
    case "match": return "text-emerald-300";
    case "mismatch": return "text-rose-300";
    default: return "text-cyan-300";
  }
}

/* ── shared UI components ── */
type PanelProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Panel({ icon: Icon, title, description, action, children, className }: PanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-7",
        className,
      )}
    >
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </motion.section>
  );
}

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-slate-200">
      {children}
    </label>
  );
}

export function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="px-5 py-5 sm:px-6">
      <div className="flex items-center gap-3 text-slate-300">
        <Icon className="h-4 w-4 text-emerald-300" />
        <span className="text-sm uppercase tracking-[0.24em] text-slate-400">{label}</span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-white">{value}</div>
    </div>
  );
}

export function StatusPill({ status }: { status: EvidenceStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]", getStatusTone(status))}>
      {getStatusLabel(status)}
    </span>
  );
}

export const inputClassName =
  "mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/40 focus:ring-2 focus:ring-emerald-300/10";

export const textareaClassName = `${inputClassName} min-h-[132px] resize-none`;

/* ── page header component ── */
export function PageHeader({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-8"
    >
      <div className="flex items-center gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-1 text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}
