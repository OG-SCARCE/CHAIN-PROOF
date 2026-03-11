import { useRef, type ChangeEvent, type FormEvent } from "react";
import { Fingerprint, ArrowRight } from "lucide-react";
import { useEvidence } from "@/context/EvidenceContext";
import {
  Panel,
  FieldLabel,
  PageHeader,
  inputClassName,
  textareaClassName,
  HASH_OPTIONS,
  initialIntakeState,
  createReference,
  digestSource,
  type HashAlgorithm,
  type EvidenceRecord,
} from "@/components/shared";
import { cn } from "@/utils/cn";
import PixelSnow from "@/components/PixelSnow";

export default function IntakePage() {
  const { intake, setIntake, setRecords, setSelectedId, formMessage, setFormMessage, isSubmitting, setIsSubmitting } = useEvidence();
  const intakeFileRef = useRef<HTMLInputElement | null>(null);

  const handleIntakeFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setIntake((current) => ({ ...current, sourceFile: file }));
  };

  const handleCreateEvidence = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");

    if (
      !intake.title.trim() ||
      !intake.ownerAgency.trim() ||
      !intake.evidenceType.trim() ||
      !intake.collectedBy.trim() ||
      !intake.sceneLocation.trim()
    ) {
      setFormMessage("Complete the intake details before sealing evidence.");
      return;
    }

    if (intake.sourceMode === "file" && !intake.sourceFile) {
      setFormMessage("Attach the evidence file to generate an integrity hash.");
      return;
    }

    if (intake.sourceMode === "text" && !intake.sourceText.trim()) {
      setFormMessage("Provide the evidence text or transcript to hash.");
      return;
    }

    setIsSubmitting(true);

    try {
      const sourceBuffer =
        intake.sourceMode === "file"
          ? await intake.sourceFile!.arrayBuffer()
          : new TextEncoder().encode(intake.sourceText).buffer;

      const digest = await digestSource(intake.algorithm, sourceBuffer);
      const timestamp = new Date().toISOString();
      const caseId = intake.caseReference.trim() || createReference("CASE");

      const newRecord: EvidenceRecord = {
        id: createReference("EV"),
        caseId,
        title: intake.title.trim(),
        ownerAgency: intake.ownerAgency.trim(),
        evidenceType: intake.evidenceType.trim(),
        sourceMode: intake.sourceMode,
        description: intake.description.trim(),
        fileName: intake.sourceMode === "file" ? intake.sourceFile?.name : undefined,
        fileSize: intake.sourceMode === "file" ? intake.sourceFile?.size : undefined,
        textLength: intake.sourceMode === "text" ? intake.sourceText.length : undefined,
        algorithm: intake.algorithm,
        digest,
        createdAt: timestamp,
        collectedBy: intake.collectedBy.trim(),
        currentCustodian: intake.collectedBy.trim(),
        sceneLocation: intake.sceneLocation.trim(),
        sealCode: createReference("SEAL"),
        status: "sealed",
        chain: [
          {
            id: createReference("LOG"),
            kind: "Intake",
            actor: intake.collectedBy.trim(),
            recipient: intake.collectedBy.trim(),
            location: intake.sceneLocation.trim(),
            timestamp,
            notes: intake.description.trim() || `${intake.title.trim()} captured, hashed, and sealed.`,
            integrity: "captured",
          },
        ],
      };

      setRecords((current) => [newRecord, ...current]);
      setSelectedId(newRecord.id);
      setIntake(initialIntakeState());
      setFormMessage(`Evidence ${newRecord.id} sealed and indexed with ${newRecord.algorithm}.`);

      if (intakeFileRef.current) {
        intakeFileRef.current.value = "";
      }
    } catch {
      setFormMessage("Unable to hash the evidence source in this browser session.");
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
          icon={Fingerprint}
          title="Evidence Intake"
          subtitle="Capture a file or transcript, hash it in the browser, and generate a sealed evidence record."
        />

        {formMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
            {formMessage}
          </div>
        )}

        <Panel
          icon={Fingerprint}
          title="Seal New Evidence"
          description="Fill in the details below to capture and cryptographically seal a new piece of evidence."
        >
          <form className="space-y-6" onSubmit={handleCreateEvidence}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="caseReference">Case reference</FieldLabel>
                <input
                  id="caseReference"
                  value={intake.caseReference}
                  onChange={(event) => setIntake((current) => ({ ...current, caseReference: event.target.value }))}
                  className={inputClassName}
                  placeholder="Leave blank to auto-generate"
                />
              </div>
              <div>
                <FieldLabel htmlFor="algorithm">Hash algorithm</FieldLabel>
                <select
                  id="algorithm"
                  value={intake.algorithm}
                  onChange={(event) => setIntake((current) => ({ ...current, algorithm: event.target.value as HashAlgorithm }))}
                  className={inputClassName}
                >
                  {HASH_OPTIONS.map((algorithm) => (
                    <option key={algorithm} value={algorithm} className="bg-slate-950 text-white">
                      {algorithm}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="title">Evidence title</FieldLabel>
                <input
                  id="title"
                  value={intake.title}
                  onChange={(event) => setIntake((current) => ({ ...current, title: event.target.value }))}
                  className={inputClassName}
                  placeholder="Disk image from workstation 04"
                />
              </div>
              <div>
                <FieldLabel htmlFor="evidenceType">Evidence type</FieldLabel>
                <input
                  id="evidenceType"
                  value={intake.evidenceType}
                  onChange={(event) => setIntake((current) => ({ ...current, evidenceType: event.target.value }))}
                  className={inputClassName}
                  placeholder="Drive image, chat export, log archive"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ownerAgency">Agency or team</FieldLabel>
                <input
                  id="ownerAgency"
                  value={intake.ownerAgency}
                  onChange={(event) => setIntake((current) => ({ ...current, ownerAgency: event.target.value }))}
                  className={inputClassName}
                  placeholder="Digital Crimes Unit"
                />
              </div>
              <div>
                <FieldLabel htmlFor="collectedBy">Collected by</FieldLabel>
                <input
                  id="collectedBy"
                  value={intake.collectedBy}
                  onChange={(event) => setIntake((current) => ({ ...current, collectedBy: event.target.value }))}
                  className={inputClassName}
                  placeholder="Investigator name"
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="sceneLocation">Collection location</FieldLabel>
              <input
                id="sceneLocation"
                value={intake.sceneLocation}
                onChange={(event) => setIntake((current) => ({ ...current, sceneLocation: event.target.value }))}
                className={inputClassName}
                placeholder="Lab intake locker A3"
              />
            </div>

            <div>
              <span className="text-sm font-medium text-slate-200">Source mode</span>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {([
                  { label: "File evidence", value: "file" },
                  { label: "Text evidence", value: "text" },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setIntake((current) => ({
                        ...current,
                        sourceMode: option.value,
                        sourceFile: option.value === "file" ? current.sourceFile : null,
                      }))
                    }
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-left text-sm transition",
                      intake.sourceMode === option.value
                        ? "border-emerald-300/40 bg-emerald-300/10 text-white"
                        : "border-white/10 bg-slate-950/40 text-slate-300 hover:border-white/20",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {intake.sourceMode === "file" ? (
              <div>
                <FieldLabel htmlFor="sourceFile">Evidence file</FieldLabel>
                <input
                  ref={intakeFileRef}
                  id="sourceFile"
                  type="file"
                  onChange={handleIntakeFileChange}
                  className={`${inputClassName} file:mr-4 file:rounded-full file:border-0 file:bg-emerald-300/15 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-100`}
                />
              </div>
            ) : (
              <div>
                <FieldLabel htmlFor="sourceText">Transcript or captured text</FieldLabel>
                <textarea
                  id="sourceText"
                  value={intake.sourceText}
                  onChange={(event) => setIntake((current) => ({ ...current, sourceText: event.target.value }))}
                  className={textareaClassName}
                  placeholder="Paste the log output, transcript, or textual evidence here"
                />
              </div>
            )}

            <div>
              <FieldLabel htmlFor="description">Collection notes</FieldLabel>
              <textarea
                id="description"
                value={intake.description}
                onChange={(event) => setIntake((current) => ({ ...current, description: event.target.value }))}
                className={textareaClassName}
                placeholder="Record context, acquisition method, or chain instructions"
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">Hashes are generated with the Web Crypto API.</p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Seal Evidence
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
