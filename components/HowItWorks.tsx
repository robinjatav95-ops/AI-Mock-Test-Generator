const STEPS = [
  {
    number: "01",
    title: "Upload",
    description:
      "Upload question photos, PDFs, screenshots, or paste text.",
    icon: (
      <path
        d="M12 15V4M12 4l-4 4M12 4l4 4M5 15v3a2 2 0 002 2h10a2 2 0 002-2v-3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    number: "02",
    title: "Review",
    description: "Check and edit the questions before creating your test.",
    icon: (
      <path
        d="M4 6h11M4 12h16M4 18h8M17 16l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    number: "03",
    title: "Generate",
    description: "Choose your test settings and generate your mock test.",
    icon: (
      <path
        d="M4 17l5-9 4 6 3-4 4 7M4 20h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    number: "04",
    title: "Practice",
    description: "Take the test and see your score and performance.",
    icon: (
      <path
        d="M9 12l2 2 4-4M12 4a8 8 0 100 16 8 8 0 000-16z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-line">
      <div className="mx-auto max-w-content px-6 py-20 lg:px-10 lg:py-28">
        <h2 className="max-w-lg font-display text-[2rem] leading-tight text-ink sm:text-[2.35rem]">
          From Questions to Test in Four Simple Steps
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="group rounded-2xl border border-line bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/[0.06] text-navy">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    {step.icon}
                  </svg>
                </div>
                <span className="font-display text-2xl text-ink-faint/70">
                  {step.number}
                </span>
              </div>
              <h3 className="mt-5 text-[17px] font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
