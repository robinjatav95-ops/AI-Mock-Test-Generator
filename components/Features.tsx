const FEATURES = [
  {
    title: "Multiple Upload Options",
    description: "Upload images, PDFs, screenshots, or text.",
    icon: (
      <path
        d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1zM14 3v5h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Smart Question Extraction",
    description: "Questions and options are organized automatically.",
    icon: (
      <path
        d="M4 6h16M4 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Custom Mock Tests",
    description: "Choose questions, time, difficulty, and marking settings.",
    icon: (
      <path
        d="M4 6h9M4 12h16M4 18h9M17 5v2M17 17v2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: "Exam-Style Test Interface",
    description:
      "Practice with a clean interface designed for focused testing.",
    icon: (
      <path
        d="M9 3h6l2 4h-10l2-4zM5 7h14l-1 13a1 1 0 01-1 1H7a1 1 0 01-1-1L5 7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Instant Results",
    description:
      "See your score, correct answers, wrong answers, and skipped questions.",
    icon: (
      <path
        d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3.5 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Question Explanations",
    description: "Review questions and understand why an answer is correct.",
    icon: (
      <path
        d="M12 18h.01M9.5 9.2a2.5 2.5 0 113.2 2.4c-.9.3-1.7.9-1.7 2v.4M12 21a9 9 0 100-18 9 9 0 000 18z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="border-b border-line bg-card/40">
      <div className="mx-auto max-w-content px-6 py-20 lg:px-10 lg:py-28">
        <h2 className="max-w-lg font-display text-[2rem] leading-tight text-ink sm:text-[2.35rem]">
          Everything You Need for Better Practice
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-line bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-pale text-amber-deep">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="mt-5 text-[17px] font-semibold text-ink">
                {feature.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
