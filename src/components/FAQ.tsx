import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Do I need an active internet connection to use ChainProof?",
    answer: "Yes, to load the web app initially. However, all cryptographic hashing and rendering happens locally in your browser. ChainProof does not send your raw files to any server.",
  },
  {
    question: "What happens if I lose my local storage data?",
    answer: "Because ChainProof operates fundamentally offline-first, your evidence registry lives in your browser's local storage. On the Free tier, clearing your browser data will wipe your registry. Professional and Enterprise tiers include encrypted cloud-sync to prevent data loss.",
  },
  {
    question: "How secure is the browser-side hashing?",
    answer: "Extremely secure. We use the native Web Crypto API built into modern browsers to perform SHA-256, SHA-384, or SHA-512 digests. This is the exact same cryptographic standard used by governments and financial institutions.",
  },
  {
    question: "Can I export my evidence logs for court presentations?",
    answer: "Yes! ChainProof allows you to export full custody transfer logs and verification checkpoints as PDF or CSV formats, making it simple to present a verified chain of custody to legal entities.",
  },
  {
    question: "Is ChainProof compliant with criminal justice standards?",
    answer: "ChainProof's audit trails are designed to exceed standard DOJ and NIST guidelines for digital evidence handling. Every action—intake, transfer, and verification—is cryptographically stamped and immutable.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="border-b border-white/[0.06] bg-[#02050b] py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-emerald-300/80">Support</p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-400">
            Have another question? Reach out to support@chainproof.com.
          </p>
        </div>

        <div className="mt-16 sm:mt-20">
          <dl className="mt-10 space-y-4 divide-y divide-white/10">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="pt-6">
                  <dt>
                    <button
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-start justify-between text-left text-white focus:outline-none"
                    >
                      <span className="text-base font-semibold leading-7">{faq.question}</span>
                      <span className="ml-6 flex h-7 items-center">
                        {isOpen ? (
                          <Minus className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                        ) : (
                          <Plus className="h-5 w-5 text-slate-400" aria-hidden="true" />
                        )}
                      </span>
                    </button>
                  </dt>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.dd
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="mt-2 pr-12"
                      >
                        <p className="text-base leading-7 text-slate-400">{faq.answer}</p>
                      </motion.dd>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
