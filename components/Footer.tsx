import Logo from "./Logo";

const FOOTER_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-paper">
      <div className="mx-auto flex max-w-content flex-col gap-8 px-6 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex items-center gap-2.5">
          <Logo className="h-7 w-7" />
          <div>
            <p className="font-display text-[15px] text-ink">MockAI</p>
            <p className="text-sm text-ink-faint">
              Turn questions into practice.
            </p>
          </div>
        </div>

        <ul className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-ink-soft">
          {FOOTER_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="transition-colors hover:text-ink">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line px-6 py-6 lg:px-10">
        <p className="text-sm text-ink-faint">
          © 2026 MockAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
