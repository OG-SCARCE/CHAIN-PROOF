import { motion, type Variants } from "framer-motion";

const technologies = [
  {
    name: "React",
    description: "Component-based UI library",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    name: "TypeScript",
    description: "Type-safe JavaScript",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    color: "from-blue-600/20 to-blue-400/20",
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first styling",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
    color: "from-teal-500/20 to-emerald-500/20",
  },
  {
    name: "Vite",
    description: "Next Generation Frontend Tooling",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg",
    color: "from-purple-500/20 to-fuchsia-500/20",
  },
  {
    name: "Framer Motion",
    description: "Production-ready animation",
    logo: "https://pagepro.co/blog/wp-content/uploads/2020/03/framer-motion.png",
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    name: "Web Crypto API",
    description: "Browser-native cryptographic primitives",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/1200px-ISO_C%2B%2B_Logo.svg.png", // generic tech logo placeholder
    color: "from-slate-500/20 to-gray-500/20",
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function TechStack() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-[#02050b] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-emerald-300/80">
            Powered By
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Modern Tech Stack
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-400">
            Built with cutting-edge tools to ensure speed, security, and a seamless developer experience entirely within the browser.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3"
        >
          {technologies.map((tech) => (
            <motion.div
              key={tech.name}
              variants={itemVariants}
              className="relative flex items-center gap-x-6 rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-300 hover:border-emerald-400/20 hover:bg-white/[0.04]"
            >
              <div className={`flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${tech.color} border border-white/10`}>
                <img src={tech.logo} alt={tech.name} className="h-8 w-8 object-contain" />
              </div>
              <div className="flex-auto">
                <h3 className="text-base font-semibold leading-7 text-white">
                  {tech.name}
                </h3>
                <p className="text-sm leading-6 text-slate-400">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
