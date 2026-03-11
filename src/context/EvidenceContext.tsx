import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  STORAGE_KEY,
  initialIntakeState,
  initialTransferState,
  initialVerifyState,
  type EvidenceRecord,
  type EvidenceStatus,
  type IntakeFormState,
  type TransferFormState,
  type VerifyFormState,
  type VerificationOutcome,
} from "@/components/shared";

type EvidenceContextValue = {
  records: EvidenceRecord[];
  setRecords: React.Dispatch<React.SetStateAction<EvidenceRecord[]>>;
  selectedId: string;
  setSelectedId: (id: string) => void;
  selectedRecord: EvidenceRecord | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "all" | EvidenceStatus;
  setStatusFilter: (filter: "all" | EvidenceStatus) => void;
  filteredRecords: EvidenceRecord[];
  intake: IntakeFormState;
  setIntake: React.Dispatch<React.SetStateAction<IntakeFormState>>;
  transfer: TransferFormState;
  setTransfer: React.Dispatch<React.SetStateAction<TransferFormState>>;
  verify: VerifyFormState;
  setVerify: React.Dispatch<React.SetStateAction<VerifyFormState>>;
  verificationOutcome: VerificationOutcome | null;
  setVerificationOutcome: (outcome: VerificationOutcome | null) => void;
  formMessage: string;
  setFormMessage: (message: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  summary: {
    cases: number;
    evidence: number;
    verified: number;
    alerts: number;
    transfers: number;
  };
  recentActivity: Array<{
    id: string;
    kind: string;
    actor: string;
    recipient: string;
    location: string;
    timestamp: string;
    notes: string;
    integrity: string;
    evidenceId: string;
    evidenceTitle: string;
  }>;
  clearWorkspace: () => void;
};

const EvidenceContext = createContext<EvidenceContextValue | null>(null);

export function useEvidence() {
  const ctx = useContext(EvidenceContext);
  if (!ctx) throw new Error("useEvidence must be used within EvidenceProvider");
  return ctx;
}

export function EvidenceProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EvidenceStatus>("all");
  const [intake, setIntake] = useState<IntakeFormState>(initialIntakeState);
  const [transfer, setTransfer] = useState<TransferFormState>(initialTransferState);
  const [verify, setVerify] = useState<VerifyFormState>(initialVerifyState);
  const [verificationOutcome, setVerificationOutcome] = useState<VerificationOutcome | null>(null);
  const [formMessage, setFormMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* hydrate from localStorage */
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const parsed = JSON.parse(stored) as EvidenceRecord[];
    setRecords(parsed);
    if (parsed[0]) setSelectedId(parsed[0].id);
  }, []);

  /* persist to localStorage */
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  /* keep selectedId in-sync */
  useEffect(() => {
    if (!records.length) { setSelectedId(""); return; }
    if (!records.some((r) => r.id === selectedId)) setSelectedId(records[0]?.id ?? "");
  }, [records, selectedId]);

  const selectedRecord = useMemo(
    () => records.find((r) => r.id === selectedId) ?? null,
    [records, selectedId],
  );

  /* sync transfer/verify forms to selectedRecord */
  useEffect(() => {
    if (!selectedRecord) return;
    setTransfer((c) => ({
      ...c,
      evidenceId: selectedRecord.id,
      actor: selectedRecord.currentCustodian,
      location: c.location || selectedRecord.sceneLocation,
    }));
    setVerify((c) => ({
      ...c,
      evidenceId: selectedRecord.id,
      location: c.location || selectedRecord.sceneLocation,
    }));
  }, [selectedRecord]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesQuery = [record.id, record.caseId, record.title, record.ownerAgency, record.currentCustodian]
        .join(" ").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || record.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const summary = useMemo(() => {
    const cases = new Set(records.map((r) => r.caseId)).size;
    const transferEvents = records.reduce(
      (count, r) => count + r.chain.filter((e) => e.kind === "Transfer").length, 0,
    );
    return {
      cases,
      evidence: records.length,
      verified: records.filter((r) => r.lastVerificationResult === "match").length,
      alerts: records.filter((r) => r.lastVerificationResult === "mismatch").length,
      transfers: transferEvents,
    };
  }, [records]);

  const recentActivity = useMemo(() => {
    return records
      .flatMap((r) => r.chain.map((e) => ({ ...e, evidenceId: r.id, evidenceTitle: r.title })))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);
  }, [records]);

  const clearWorkspace = () => {
    if (!window.confirm("Clear all locally stored evidence records from this device?")) return;
    setRecords([]);
    setSelectedId("");
    setVerificationOutcome(null);
    setFormMessage("Workspace cleared from local storage.");
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const value: EvidenceContextValue = {
    records, setRecords,
    selectedId, setSelectedId,
    selectedRecord,
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    filteredRecords,
    intake, setIntake,
    transfer, setTransfer,
    verify, setVerify,
    verificationOutcome, setVerificationOutcome,
    formMessage, setFormMessage,
    isSubmitting, setIsSubmitting,
    summary,
    recentActivity,
    clearWorkspace,
  };

  return <EvidenceContext.Provider value={value}>{children}</EvidenceContext.Provider>;
}
