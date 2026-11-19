'use client';

import { STRINGS } from '@/lib/strings';

export default function RomanticHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 py-16 px-4 text-center">
      {/* Decorative hearts */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 -left-6 text-[8rem] text-rose-200 opacity-40 select-none"
      >
        ♥
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 -right-6 text-[6rem] text-pink-200 opacity-40 select-none"
      >
        ♥
      </span>

      <p className="mb-3 font-semibold uppercase tracking-widest text-rose-400 text-sm">
        ✦ Romantic Collection ✦
      </p>
      <h1 className="font-serif text-4xl font-bold text-rose-700 sm:text-5xl md:text-6xl">
        {STRINGS.hero.heading}
      </h1>
      <p className="mt-4 mx-auto max-w-xl text-base text-rose-500 sm:text-lg">
        {STRINGS.hero.subheading}
      </p>
    </section>
  );
}
