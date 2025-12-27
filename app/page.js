import Link from 'next/link';

const experiments = [
  {
    href: "/interdisciplinary",
    title: "Interdisciplinary",
    description: "Merge disciplines, find connections"
  },
  {
    href: "/vibe",
    title: "Vibe",
    description: "Start from a feeling"
  },
  {
    href: "/explain",
    title: "Explain",
    description: "Understand through conversation"
  },
  {
    href: "/questions",
    title: "Questions",
    description: "Explore through inquiry"
  },
  {
    href: "/define",
    title: "Define",
    description: "Clarify through reflection"
  },
  {
    href: "/deck",
    title: "Deck",
    description: "Cards that provoke thinking"
  },
  {
    href: "/board",
    title: "Board",
    description: "AI-powered organization"
  },
  {
    href: "/receipt",
    title: "Receipt",
    description: "Capture as artifact"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-900 text-surface-50 overflow-hidden">
      {/* Hero */}
      <header className="min-h-[70vh] flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-neutral-800">
        <div className="flex flex-col font-[family-name:var(--font-magilio)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight text-yellow-50">
          <div className="flex items-baseline gap-2">
            <div className="text-5xl">The</div>
            <div className="text-secondary-600 underline text-[1.1em]">Serendipity</div>
          </div>
          <div className="ml-12 -mt-2 underline">Engine</div>
        </div>
        <div className="mt-8 text-xl md:text-xl text-surface-50/60 text-yellow-50/80 uppercase flex flex-col">
          <div>AI experiments for exploration, discovery & learning.</div>
          <div className="text-secondary-500 -mt-1">generating Inspiration & curiosity.</div>
        </div>
      </header>

      {/* Manifesto Strip */}
      <section className="bg-secondary-500 text-surface-900 py-6 px-8 md:px-16">
        <p className="font-[family-name:var(--font-fraunces)] text-lg md:text-xl lg:text-2xl font-medium text-neutral-800">
          What if AI helped us wander instead of conclude? Discover instead of decide?
        </p>
      </section>

      {/* Experiments */}
      <section className="px-8 md:px-16 lg:px-24 py-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-surface-50/40 mb-12">
          Experiments
        </h2>
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-2">
          {experiments.map((exp) => (
            <Link
              key={exp.href}
              href={exp.href}
              className="group py-5 border-b border-surface-50/10 hover:border-secondary-400 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-[family-name:var(--font-magilio)] text-3xl md:text-4xl text-surface-50 group-hover:text-secondary-400 transition-colors">
                  {exp.title}
                </h3>
                <span className="text-2xl text-surface-50/20 group-hover:text-secondary-400 group-hover:translate-x-2 transition-all">
                  →
                </span>
              </div>
              <p className="text-surface-50/50 mt-2 group-hover:text-surface-50/70 transition-colors">
                {exp.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
