import CyberMatrixHero from "@/components/ui/cyber-matrix-hero";

export default function DemoOne() {
  return (
    <main className="bg-black">
      <CyberMatrixHero
        brand="ChainProof"
        title="Integrity Verification Workspace"
        tagline="Securing digital evidence with tamper-proof integrity."
        primaryActionLabel="Launch Workspace"
      />
      <div className="flex h-screen items-center justify-center bg-black p-8 text-center text-4xl text-white">
        <p>This section is a placeholder for the rest of your page content.</p>
      </div>
    </main>
  );
}