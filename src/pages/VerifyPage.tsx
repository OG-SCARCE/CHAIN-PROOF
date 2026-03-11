import { useRef, type ChangeEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useEvidence } from "@/context/EvidenceContext";
import {
  Panel,
  FieldLabel,
  PageHeader,
  inputClassName,
  textareaClassName,
  createReference,
  digestSource,
  shortHash,
  formatDate,
} from "@/components/shared";
import { cn } from "@/utils/cn";
import PixelSnow from "@/components/PixelSnow";

export default function VerifyPage() {
  const {
    records,
    selectedRecord,
    verify,
    setVerify,
    setSelectedId,
    setRecords,
    verificationOutcome,
    setVerificationOutcome,
    formMessage,
    setFormMessage,
    isSubmitting,
    setIsSubmitting,
  } = useEvidence();

  const verifyFileRef = useRef<HTMLInputElement | null>(null);

  const handleVerifyFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setVerify((current) => ({ ...current, sourceFile: file }));
  };

  const handleVerifyEvidence = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");

    const record = records.find((item) => item.id === verify.evidenceId);
    if (!record || !verify.verifiedBy.trim() || !verify.location.trim()) {
      setFormMessage("Choose an evidence record and complete the verification details.");
      return;
    }

    if (record.sourceMode === "file" && !verify.sourceFile) {
      setFormMessage("Upload the evidence file again to compare its digest.");
      return;
    }

    if (record.sourceMode === "text" && !verify.sourceText.trim()) {
      setFormMessage("Paste the evidence text again to compare its digest.");
      return;
    }

    setIsSubmitting(true);

    try {
      const sourceBuffer =
        record.sourceMode === "file"
          ? await verify.sourceFile!.arrayBuffer()
          : new TextEncoder().encode(verify.sourceText).buffer;

      const candidateDigest = await digestSource(record.algorithm, sourceBuffer);
      const matched = candidateDigest === record.digest;
      const timestamp = new Date().toISOString();

      setRecords((current) =>
        current.map((item) => {
          if (item.id !== record.id) return item;
          return {
            ...item,
            status: matched ? "verified" : "alert",
            lastVerifiedAt: timestamp,
            lastVerificationResult: matched ? "match" : "mismatch",
            chain: [
              {
                id: createReference("LOG"),
                kind: "Verification",
                actor: verify.verifiedBy.trim(),
                recipient: item.currentCustodian,
                location: verify.location.trim(),
                timestamp,
                notes: matched
                  ? `${item.algorithm} digest confirmed during verification.`
                  : `${item.algorithm} digest mismatch detected during verification.`,
                integrity: matched ? "match" : "mismatch",
              },
              ...item.chain,
            ],
          };
        }),
      );

      setVerificationOutcome({
        evidenceId: record.id,
        timestamp,
        candidateDigest,
        matched,
      });

      setVerify((current) => ({
        ...current,
        sourceText: "",
        sourceFile: null,
      }));
      if (verifyFileRef.current) {
        verifyFileRef.current.value = "";
      }

      setFormMessage(matched ? `Integrity confirmed for ${record.id}.` : `Integrity alert raised for ${record.id}.`);
    } catch {
      setFormMessage("Unable to complete integrity verification in this browser session.");
    } finally {
      setIsSubmitting(false);
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
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-12 sm:px-8">
        <PageHeader
          icon={ShieldCheck}
          title="Integrity Verification"
          subtitle="Re-run the digest on the original evidence source and compare it against the sealed hash."
        />

        {formMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
            {formMessage}
          </div>
        )}

        <Panel
          icon={ShieldCheck}
          title="Run Verification"
          description="Select a sealed evidence record and provide the original source to verify its integrity."
        >
          <form className="space-y-6" onSubmit={handleVerifyEvidence}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="verifyEvidence">Evidence record</FieldLabel>
                <select
                  id="verifyEvidence"
                  value={verify.evidenceId}
                  onChange={(event) => {
                    const nextId = event.target.value;
                    setSelectedId(nextId);
                    setVerify((current) => ({ ...current, evidenceId: nextId, sourceText: "", sourceFile: null }));
                    if (verifyFileRef.current) verifyFileRef.current.value = "";
                  }}
                  className={inputClassName}
                  disabled={!records.length}
                >
                  <option value="" className="bg-slate-950 text-white">
                    {records.length ? "Select evidence" : "Create evidence first"}
                  </option>
                  {records.map((record) => (
                    <option key={record.id} value={record.id} className="bg-slate-950 text-white">
                      {record.id} - {record.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="verifiedBy">Verified by</FieldLabel>
                <input
                  id="verifiedBy"
                  value={verify.verifiedBy}
                  onChange={(event) => setVerify((current) => ({ ...current, verifiedBy: event.target.value }))}
                  className={inputClassName}
                  placeholder="Analyst or reviewer"
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="verifyLocation">Verification location</FieldLabel>
              <input
                id="verifyLocation"
                value={verify.location}
                onChange={(event) => setVerify((current) => ({ ...current, location: event.target.value }))}
                className={inputClassName}
                placeholder="Forensics lab station"
              />
            </div>

            {selectedRecord?.sourceMode === "file" ? (
              <div>
                <FieldLabel htmlFor="verifyFile">Upload original evidence file</FieldLabel>
                <input
                  ref={verifyFileRef}
                  id="verifyFile"
                  type="file"
                  onChange={handleVerifyFileChange}
                  className={`${inputClassName} file:mr-4 file:rounded-full file:border-0 file:bg-emerald-300/15 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-100`}
                />
              </div>
            ) : (
              <div>
                <FieldLabel htmlFor="verifyText">Paste original evidence text</FieldLabel>
                <textarea
                  id="verifyText"
                  value={verify.sourceText}
                  onChange={(event) => setVerify((current) => ({ ...current, sourceText: event.target.value }))}
                  className={textareaClassName}
                  placeholder="Paste the exact original transcript or text again"
                />
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                {selectedRecord
                  ? `Stored digest uses ${selectedRecord.algorithm} and ${selectedRecord.sourceMode === "file" ? "file" : "text"} capture.`
                  : "Select a record to enable verification details."}
              </p>
              <button
                type="submit"
                disabled={!records.length || isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Run Verification
                <ShieldCheck className="h-4 w-4" />
              </button>
            </div>

            <AnimatePresence>
              {verificationOutcome && selectedRecord && verificationOutcome.evidenceId === selectedRecord.id ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className={cn(
                    "rounded-3xl border px-5 py-5",
                    verificationOutcome.matched
                      ? "border-emerald-400/25 bg-emerald-400/10"
                      : "border-rose-400/25 bg-rose-400/10",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {verificationOutcome.matched ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                    ) : (
                      <ShieldAlert className="h-5 w-5 text-rose-200" />
                    )}
                    <p className="font-semibold text-white">
                      {verificationOutcome.matched ? "Integrity confirmed" : "Integrity mismatch detected"}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-200">
                    Candidate digest: <span className="font-mono text-xs text-white/90">{shortHash(verificationOutcome.candidateDigest)}</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-300">Checked at {formatDate(verificationOutcome.timestamp)}.</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </form>
        </Panel>
      </div>
    </div>
  );
}
