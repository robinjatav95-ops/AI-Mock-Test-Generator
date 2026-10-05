const OPTIONS = [
  { label: "A", text: "City" },
  { label: "B", text: "Delhi" },
  { label: "C", text: "Country" },
  { label: "D", text: "River" },
];

export default function TestPreview() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-content px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.85fr,1fr] lg:items-center lg:gap-16">
          <div className="max-w-md">
            <h2 className="font-display text-[2rem] leading-tight text-ink sm:text-[2.35rem]">
              A Testing Experience That Feels Like the Real Exam
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              A distraction-free layout, a visible timer, and clear question
              navigation, so practice sessions feel just like exam day.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <span className="absolute -top-3 right-4 rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-ink-faint">
              Product preview
            </span>
            <div className="rounded-2xl border border-line bg-card shadow-lifted">
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <span className="text-[15px] font-semibold text-ink">
                  SSC CGL Practice Test
                </span>
                <span className="rounded-full bg-navy/[0.06] px-2.5 py-1 text-xs font-medium text-navy">
                  12:34 remaining
                </span>
              </div>

              <div className="px-6 py-6">
                <span className="text-xs font-medium text-ink-faint">
                  Question 7 of 20
                </span>
                <p className="mt-2 text-[17px] leading-snug text-ink">
                  Which of the following is a proper noun?
                </p>

                <div className="mt-5 flex flex-col gap-2.5">
                  {OPTIONS.map((option) => (
                    <div
                      key={option.label}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-[15px] transition-colors ${
                        option.label === "B"
                          ? "border-navy/30 bg-navy/[0.05] text-ink"
                          : "border-line text-ink-soft"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                          option.label === "B"
                            ? "bg-navy text-paper"
                            : "bg-paper text-ink-faint"
                        }`}
                      >
                        {option.label}
                      </span>
                      {option.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-line px-6 py-4">
                <button
                  type="button"
                  className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-line/30"
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-navy-deep"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
