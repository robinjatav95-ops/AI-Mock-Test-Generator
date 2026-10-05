export default function CTASection() {
  return (
    <section id="about" className="border-b border-line bg-navy-deep">
      <div className="mx-auto max-w-content px-6 py-20 text-center lg:px-10 lg:py-24">
        <h2 className="mx-auto max-w-xl font-display text-[2rem] leading-tight text-paper sm:text-[2.4rem]">
          Ready to turn your questions into a test?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-paper/70">
          Upload your questions and start practicing smarter.
        </p>
        <button
          type="button"
          className="mt-8 rounded-full bg-amber px-8 py-3.5 text-[15px] font-medium text-ink shadow-lifted transition-all hover:bg-amber-deep hover:text-paper active:scale-[0.98]"
        >
          Create Your First Mock
        </button>
      </div>
    </section>
  );
}
