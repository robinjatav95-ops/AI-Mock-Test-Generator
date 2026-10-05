# MockAI — Homepage

Marketing homepage for MockAI, built with Next.js (App Router), React, TypeScript, and Tailwind CSS. This is UI only — no auth, database, file upload, AI/OCR, or payment logic is wired up yet, by design.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. (The first `npm run build` needs internet access once, to fetch the Fraunces/Inter fonts from Google Fonts — after that they're cached locally by Next.js.)

## Where things live

```
app/
  layout.tsx      → root layout, loads fonts, sets page metadata
  page.tsx         → assembles the homepage from section components
  globals.css      → Tailwind entry point, focus states, reduced-motion, paper texture
components/
  Logo.tsx          → shared logo mark (navbar + footer)
  Navbar.tsx         → sticky nav, mobile menu (client component)
  Hero.tsx            → headline + "Create Mock Test" product preview card
  HowItWorks.tsx       → 4-step process cards
  Features.tsx          → 6 feature cards
  TestPreview.tsx        → example "SSC CGL Practice Test" mock (visual only)
  CTASection.tsx          → closing call-to-action band
  Footer.tsx                → footer links + copyright
tailwind.config.ts    → design tokens: colors, fonts, shadows, animation
```

Every section is its own component and is imported into `app/page.tsx`, so you can reorder, remove, or extend sections independently.

## Design system

Colors, type, and spacing are defined once in `tailwind.config.ts` (`paper`, `ink`, `navy`, `amber`, `line`, `card`) rather than hard-coded in components, so a palette or type change is a one-file edit.

- **Display font:** Fraunces (headings)
- **Body/UI font:** Inter
- All interactive elements (buttons, links, the mobile menu toggle) have visible focus states and hover/active states.
- Motion respects `prefers-reduced-motion`.

## Notes for future development

This homepage intentionally stops at the marketing layer. When you're ready to build further, the natural extension points are:

- **Auth** — the "Log in" / "Get Started" buttons in `Navbar.tsx` are plain `<button>` placeholders; swap in your auth provider's links/handlers there.
- **Supabase / database** — no client is initialized anywhere yet.
- **File upload & storage** — the "Drop your questions here" area in `Hero.tsx` is a static visual; it isn't wired to an `<input type="file">` or any upload handler.
- **AI/OCR extraction, question review, mock generation, test engine, results & analytics** — none of these have routes or components yet. `TestPreview.tsx` is a static mock of what the test-taking UI could look like, not a working test engine.

All of the above were deliberately left out per the brief, so the homepage is a clean foundation to build on rather than something you'll need to rip out.
