import Icon from "@/components/ui/icon";
import { type Page, NAV_LINKS } from "./types";

export default function HomePage({ onDoc }: { onDoc: (id: Page) => void }) {
  return (
    <main className="grid-bg min-h-screen pt-14 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--neon)] opacity-[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute top-48 right-0 w-[300px] h-[300px] rounded-full bg-[var(--sos)] opacity-[0.04] blur-[90px]" />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[92vh] text-center px-4">
        {/* Badge */}
        <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,229,192,0.2)] bg-[var(--neon-dim)] text-xs font-mono tracking-widest neon-text">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] animate-blink" />
          GPS-ЗАЩИТА АКТИВНА
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up delay-100 font-oswald font-bold text-[clamp(3rem,10vw,8rem)] leading-[0.9] tracking-tight mb-6">
          <span className="block text-white">FLASH</span>
          <span className="block neon-text" style={{ textShadow: "0 0 40px rgba(0,229,192,0.4)" }}>
            MEET
          </span>
        </h1>

        {/* Subline */}
        <p className="animate-fade-in-up delay-200 text-[#5a7080] text-base md:text-lg max-w-xl leading-relaxed mb-3">
          Быстрые встречи, без нудной переписки — здесь и сейчас.
        </p>

        <p className="animate-fade-in-up delay-300 font-mono text-xs text-[#2e4a58] tracking-widest mb-10">
          ANTI-OPG · LIVE LOCATION · SOS BROADCAST · CRM FOR BUSINESS
        </p>

        {/* CTA */}
        <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="https://t.me/FlashMeet_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-sm bg-[var(--neon)] text-[var(--surface)] font-oswald font-semibold text-sm tracking-widest uppercase transition-all hover:brightness-110 animate-pulse-neon"
          >
            <Icon name="Send" size={16} />
            Открыть в Telegram
            <span className="absolute inset-0 rounded-sm ring-2 ring-[var(--neon)] ring-offset-2 ring-offset-[var(--surface)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <button
            onClick={() => onDoc("offer")}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-sm border border-[rgba(0,229,192,0.18)] text-[#5a7080] font-plex text-sm tracking-wide hover:border-[rgba(0,229,192,0.4)] hover:text-[var(--neon)] transition-all"
          >
            <Icon name="FileText" size={15} />
            Правовые документы
          </button>
        </div>

        {/* Stats strip */}
        <div className="animate-fade-in-up delay-500 mt-20 flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { val: "3 ч", label: "GPS-сессия" },
            { val: "5 км", label: "Радиус SOS" },
            { val: "30 сек", label: "Реакция охраны" },
            { val: "0 данных", label: "Посторонним" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-oswald text-2xl md:text-3xl font-semibold neon-text">{s.val}</div>
              <div className="font-mono text-[10px] text-[#2e4a58] tracking-widest mt-1 uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--grid-line)] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-oswald text-sm font-medium tracking-widest text-[#2e4a58]">
            FLASH<span className="text-[#3a5060]">MEET</span> © 2025
          </span>
          <div className="flex flex-wrap justify-center gap-6">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => onDoc(l.id)}
                className="text-xs text-[#2e4a58] hover:text-[var(--neon)] transition-colors tracking-wide"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
