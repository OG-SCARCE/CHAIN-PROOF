import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileDigit,
  Waypoints,
  Search,
  Copy,
  Download,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEvidence } from "@/context/EvidenceContext";
import {
  Panel,
  PageHeader,
  StatusPill,
  inputClassName,
  formatDate,
  formatBytes,
  shortHash,
  getIntegrityTone,
  type EvidenceStatus,
} from "@/components/shared";
import PixelSnow from "@/components/PixelSnow";
import { cn } from "@/utils/cn";

export default function RegistryPage() {
  const {
    selectedId,
    setSelectedId,
    selectedRecord,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredRecords,
    clearWorkspace,
  } = useEvidence();

  const [copiedDigestFor, setCopiedDigestFor] = useState<string>("");

  const exportSelectedRecord = () => {
    if (!selectedRecord) return;
    const blob = new Blob([JSON.stringify(selectedRecord, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${selectedRecord.caseId}-${selectedRecord.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const copySelectedDigest = async () => {
    if (!selectedRecord) return;
    await navigator.clipboard.writeText(selectedRecord.digest);
    setCopiedDigestFor(selectedRecord.id);
    window.setTimeout(() => setCopiedDigestFor(""), 1400);
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
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            icon={FileDigit}
            title="Evidence Registry"
            subtitle="Search, filter, inspect, and export all evidence records."
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={exportSelectedRecord}
              disabled={!selectedRecord}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-emerald-300/35 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              Export Selected
            </button>
            <button
              type="button"
              onClick={clearWorkspace}
              className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/10"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-8 xl:grid-cols-[1fr,1.1fr]">
          {/* ── record list ── */}
          <Panel
            icon={FileDigit}
            title="All Records"
            description="Search the live registry, inspect custody state, and select any record."
          >
            <div className="grid gap-4 border-b border-white/10 pb-5 sm:grid-cols-[1fr,180px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/40 focus:ring-2 focus:ring-emerald-300/10"
                  placeholder="Search by case, evidence ID, title, or custodian"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "all" | EvidenceStatus)}
                className={inputClassName.replace("mt-2 ", "")}
              >
                <option value="all" className="bg-slate-950 text-white">All states</option>
                <option value="sealed" className="bg-slate-950 text-white">Sealed</option>
                <option value="in_transfer" className="bg-slate-950 text-white">In transfer</option>
                <option value="verified" className="bg-slate-950 text-white">Verified</option>
                <option value="alert" className="bg-slate-950 text-white">Alert</option>
              </select>
            </div>

            <div className="mt-6 max-h-[600px] space-y-3 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {filteredRecords.length ? (
                  filteredRecords.map((record) => (
                    <motion.button
                      key={record.id}
                      layout
                      type="button"
                      onClick={() => setSelectedId(record.id)}
                      className={cn(
                        "w-full rounded-[24px] border p-5 text-left transition",
                        selectedId === record.id
                          ? "border-emerald-300/35 bg-emerald-300/10"
                          : "border-white/10 bg-slate-950/45 hover:border-white/20 hover:bg-white/[0.03]",
                      )}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="font-semibold text-white">{record.title}</p>
                            <StatusPill status={record.status} />
                          </div>
                          <p className="mt-2 text-sm text-slate-300">{record.id} · {record.caseId}</p>
                          <p className="mt-4 text-sm leading-6 text-slate-400">{record.ownerAgency} · {record.evidenceType}</p>
                        </div>
                        <div className="space-y-2 text-sm text-slate-300">
                          <p>Custodian: {record.currentCustodian}</p>
                          <p>Created: {formatDate(record.createdAt)}</p>
                          <p>Digest: {shortHash(record.digest)}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[24px] border border-dashed border-white/10 px-5 py-12 text-center"
                  >
                    <p className="text-lg font-medium text-white">No evidence records yet</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      Seal your first file or transcript in the intake form to populate the registry.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Panel>

          {/* ── selected record detail ── */}
          <Panel
            icon={Waypoints}
            title="Selected Record"
            description="Review sealed metadata and inspect the full custody timeline."
            action={
              selectedRecord ? (
                <button
                  type="button"
                  onClick={copySelectedDigest}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-300/35 hover:bg-white/5"
                >
                  <Copy className="h-4 w-4" />
                  {copiedDigestFor === selectedRecord.id ? "Copied" : "Copy Digest"}
                </button>
              ) : null
            }
          >
            {selectedRecord ? (
              <div className="space-y-8">
                <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/50 p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-2xl font-semibold tracking-tight text-white">{selectedRecord.title}</p>
                      <StatusPill status={selectedRecord.status} />
                    </div>
                    <div className="mt-5 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
                      <div>
                        <p className="text-slate-500">Evidence ID</p>
                        <p className="mt-1 font-medium text-white">{selectedRecord.id}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Case ID</p>
                        <p className="mt-1 font-medium text-white">{selectedRecord.caseId}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Current custodian</p>
                        <p className="mt-1 font-medium text-white">{selectedRecord.currentCustodian}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Sealed at</p>
                        <p className="mt-1 font-medium text-white">{formatDate(selectedRecord.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Capture mode</p>
                        <p className="mt-1 font-medium capitalize text-white">{selectedRecord.sourceMode}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Payload size</p>
                        <p className="mt-1 font-medium text-white">
                          {selectedRecord.sourceMode === "file"
                            ? formatBytes(selectedRecord.fileSize)
                            : `${selectedRecord.textLength ?? 0} chars`}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Stored digest</p>
                      <p className="mt-3 break-all font-mono text-sm text-emerald-100">{selectedRecord.digest}</p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-slate-950/50 p-5">
                    <div className="space-y-5 text-sm text-slate-300">
                      <div>
                        <p className="text-slate-500">Algorithm</p>
                        <p className="mt-1 font-medium text-white">{selectedRecord.algorithm}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Seal code</p>
                        <p className="mt-1 font-medium text-white">{selectedRecord.sealCode}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Agency</p>
                        <p className="mt-1 font-medium text-white">{selectedRecord.ownerAgency}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Collection point</p>
                        <p className="mt-1 font-medium text-white">{selectedRecord.sceneLocation}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Description</p>
                        <p className="mt-1 leading-6 text-slate-300">
                          {selectedRecord.description || "No collection notes supplied for this record."}
                        </p>
                      </div>
                      {selectedRecord.lastVerifiedAt && (
                        <div>
                          <p className="text-slate-500">Last verification</p>
                          <p className="mt-1 font-medium text-white">
                            {formatDate(selectedRecord.lastVerifiedAt)} · {selectedRecord.lastVerificationResult === "match" ? "Match" : "Mismatch"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* custody timeline */}
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300/80">Custody Timeline</p>
                  <div className="mt-5 space-y-4">
                    <AnimatePresence initial={false} mode="popLayout">
                      {selectedRecord.chain.map((entry) => (
                        <motion.div
                          key={entry.id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          className="relative rounded-[24px] border border-white/10 bg-slate-950/45 p-5"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <p className="font-semibold text-white">{entry.kind}</p>
                                <span className={cn("text-xs font-semibold uppercase tracking-[0.2em]", getIntegrityTone(entry.integrity))}>
                                  {entry.integrity}
                                </span>
                              </div>
                              <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                                <UserRound className="h-4 w-4 text-emerald-300" />
                                <span>{entry.actor}</span>
                                <span className="text-slate-500">to</span>
                                <span>{entry.recipient}</span>
                              </div>
                              <p className="mt-3 text-sm leading-6 text-slate-400">{entry.notes}</p>
                            </div>
                            <div className="space-y-2 text-sm text-slate-400 sm:text-right">
                              <p>{formatDate(entry.timestamp)}</p>
                              <p>{entry.location}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/10 px-5 py-14 text-center">
                <p className="text-lg font-medium text-white">Select a record to inspect its chain</p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Once you seal evidence, this panel shows the metadata, digest, and full custody timeline.
                </p>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
