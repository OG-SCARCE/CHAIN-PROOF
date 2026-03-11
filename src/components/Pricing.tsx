import { motion, type Variants } from "framer-motion";
import { Check, X } from "lucide-react";

const tiers = [
  {
    name: "Standard",
    id: "tier-standard",
    href: "#",
    price: { monthly: "$0" },
    description: "Perfect for independent investigators and small labs.",
    features: [
      "In-browser SHA-256 hashing",
      "Up to 50 active cases",
      "Local storage database",
      "Basic transfer logging",
      "Community support",
    ],
    notIncluded: ["Cloud sync", "Advanced compliance reports", "Custom branding"],
    featured: false,
    cta: "Get started for free",
  },
  {
    name: "Professional",
    id: "tier-professional",
    href: "#",
    price: { monthly: "$49" },
    description: "Advanced integrity features for growing forensic teams.",
    features: [
      "SHA-256/384/512 hashing",
      "Unlimited active cases",
      "Cloud-synced evidence registry",
      "Advanced audit trails",
      "Priority email support",
      "Exportable compliance reports",
    ],
    notIncluded: ["Custom branding"],
    featured: true,
    cta: "Start 14-day trial",
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    price: { monthly: "$199" },
    description: "Full-scale solution with custom branding and SLAs.",
    features: [
      "Everything in Professional",
      "Custom branding & white-labeling",
      "Dedicated account manager",
      "On-premise deployment options",
      "24/7 phone & chat support",
      "Custom API integrations",
    ],
    notIncluded: [],
    featured: false,
    cta: "Contact Sales",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Pricing() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-[#050814] py-24 sm:py-32">
      {/* Background Glow */}
      <div className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 flex justify-center overflow-hidden blur-3xl" aria-hidden="true">
        <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#064e3b] to-[#10b981] opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-emerald-300/80">Pricing</p>
          <h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            Choose the right plan for your team
          </h2>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-slate-400 sm:text-xl/8">
          Transparent pricing for digital forensics tools. No hidden fees.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3"
        >
          {tiers.map((tier, tierIdx) => (
            <motion.div
              key={tier.id}
              variants={itemVariants}
              className={`rounded-3xl p-8 ring-1 ring-white/10 sm:p-10 ${
                tier.featured
                  ? "relative bg-gray-900 shadow-2xl lg:z-10 lg:rounded-b-none lg:rounded-t-[3rem]"
                  : tierIdx === 0
                    ? "bg-white/[0.02] lg:rounded-r-none"
                    : "bg-white/[0.02] lg:rounded-l-none"
              }`}
            >
              {tier.featured && (
                <div className="absolute -inset-px rounded-3xl border border-emerald-500/50 lg:rounded-b-none lg:rounded-t-[3rem]" />
              )}
              {tier.featured && (
                 <div className="absolute -top-4 inset-x-0 flex justify-center">
                   <div className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">Most Popular</div>
                 </div>
              )}
              
              <h3 className="text-base/7 font-semibold text-emerald-400">
                {tier.name}
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-5xl font-semibold tracking-tight text-white">{tier.price.monthly}</span>
                <span className="text-base text-slate-400">/month</span>
              </p>
              <p className="mt-6 text-base/7 text-slate-300">{tier.description}</p>
              <ul className="mt-8 space-y-3 text-sm/6 sm:mt-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-emerald-400" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
                {tier.notIncluded.map((feature) => (
                  <li key={feature} className="flex gap-x-3 opacity-50">
                    <X className="h-6 w-5 flex-none text-slate-500" />
                    <span className="text-slate-400">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={tier.href}
                className={`mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 ${
                  tier.featured
                    ? "bg-emerald-500 text-white hover:bg-emerald-400 focus-visible:outline-emerald-500"
                    : "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white"
                }`}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
