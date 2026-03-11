import type { FormEvent } from "react";
import { Workflow, ArrowRight } from "lucide-react";
import { useEvidence } from "@/context/EvidenceContext";
import {
  Panel,
  FieldLabel,
  PageHeader,
  inputClassName,
  textareaClassName,
  createReference,
} from "@/components/shared";
import PixelSnow from "@/components/PixelSnow";

export default function TransferPage() {
  const { records, transfer, setTransfer, setRecords, setSelectedId, formMessage, setFormMessage } = useEvidence();

  const handleTransferEvidence = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");

    if (!transfer.evidenceId || !transfer.actor.trim() || !transfer.recipient.trim() || !transfer.location.trim()) {
      setFormMessage("Select an evidence record and provide every transfer detail.");
      return;
    }

    const timestamp = new Date().toISOString();

    setRecords((current) =>
      current.map((record) => {
        if (record.id !== transfer.evidenceId) return record;
        return {
          ...record,
          currentCustodian: transfer.recipient.trim(),
          status: "in_transfer",
          chain: [
            {
              id: createReference("LOG"),
              kind: "Transfer",
              actor: transfer.actor.trim(),
              recipient: transfer.recipient.trim(),
              location: transfer.location.trim(),
              timestamp,
              notes: transfer.notes.trim() || `Transferred from ${transfer.actor.trim()} to ${transfer.recipient.trim()}.`,
              integrity: "captured",
            },
            ...record.chain,
          ],
        };
      }),
    );

    setTransfer((current) => ({
      ...current,
      actor: transfer.recipient.trim(),
      recipient: "",
      notes: "",
    }));
    setFormMessage(`Custody transfer recorded for ${transfer.evidenceId}.`);
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
          icon={Workflow}
          title="Custody Transfer"
          subtitle="Log every handoff with handlers, locations, and notes to keep the evidence chain intact."
        />

        {formMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
            {formMessage}
          </div>
        )}

        <Panel
          icon={Workflow}
          title="Record a Transfer"
          description="Select an evidence record and document the custody handoff."
        >
          <form className="space-y-6" onSubmit={handleTransferEvidence}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="transferEvidence">Evidence record</FieldLabel>
                <select
                  id="transferEvidence"
                  value={transfer.evidenceId}
                  onChange={(event) => {
                    const nextId = event.target.value;
                    const record = records.find((item) => item.id === nextId);
                    setSelectedId(nextId);
                    setTransfer((current) => ({
                      ...current,
                      evidenceId: nextId,
                      actor: record?.currentCustodian ?? "",
                      location: record?.sceneLocation ?? current.location,
                    }));
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
                <FieldLabel htmlFor="transferLocation">Transfer location</FieldLabel>
                <input
                  id="transferLocation"
                  value={transfer.location}
                  onChange={(event) => setTransfer((current) => ({ ...current, location: event.target.value }))}
                  className={inputClassName}
                  placeholder="Evidence vault B"
                />
              </div>
              <div>
                <FieldLabel htmlFor="transferActor">Released by</FieldLabel>
                <input
                  id="transferActor"
                  value={transfer.actor}
                  onChange={(event) => setTransfer((current) => ({ ...current, actor: event.target.value }))}
                  className={inputClassName}
                  placeholder="Current custodian"
                />
              </div>
              <div>
                <FieldLabel htmlFor="transferRecipient">Received by</FieldLabel>
                <input
                  id="transferRecipient"
                  value={transfer.recipient}
                  onChange={(event) => setTransfer((current) => ({ ...current, recipient: event.target.value }))}
                  className={inputClassName}
                  placeholder="Next handler"
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="transferNotes">Transfer notes</FieldLabel>
              <textarea
                id="transferNotes"
                value={transfer.notes}
                onChange={(event) => setTransfer((current) => ({ ...current, notes: event.target.value }))}
                className={textareaClassName}
                placeholder="Reason for transfer, seals checked, or handling instructions"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!records.length}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-emerald-300/35 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Record Transfer
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
