import Icon from "@/components/ui/icon";
import { hexToRgb } from "./types";

export default function ContactsPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs text-[#3a5060] hover:text-[var(--neon)] transition-colors mb-8 font-mono tracking-widest"
        >
          <Icon name="ChevronLeft" size={14} />
          НА ГЛАВНУЮ
        </button>

        <div className="mb-10 pb-6 border-b border-[var(--grid-line)]">
          <p className="font-mono text-[10px] text-[var(--neon)] tracking-widest mb-2 uppercase">
            Связь с командой
          </p>
          <h1 className="font-oswald text-3xl md:text-4xl font-semibold text-white tracking-wide">
            Контакты
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: "Send",
              label: "Telegram-бот",
              value: "@FlashMeet_bot",
              href: "https://t.me/FlashMeet_bot",
              color: "var(--neon)",
            },
            {
              icon: "Mail",
              label: "Email поддержки",
              value: "support@flashmeet.app",
              href: "mailto:support@flashmeet.app",
              color: "#6b9fff",
            },
            {
              icon: "Building2",
              label: "B2B-партнёрство",
              value: "b2b@flashmeet.app",
              href: "mailto:b2b@flashmeet.app",
              color: "#b06bff",
            },
            {
              icon: "Shield",
              label: "Безопасность / SOS",
              value: "safety@flashmeet.app",
              href: "mailto:safety@flashmeet.app",
              color: "var(--sos)",
            },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-card rounded-sm p-6 flex items-start gap-4 group no-underline"
            >
              <div
                className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `rgba(${hexToRgb(c.color)}, 0.12)` }}
              >
                <Icon name={c.icon} size={18} style={{ color: c.color }} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-[#2e4a58] tracking-widest uppercase mb-1">
                  {c.label}
                </p>
                <p
                  className="text-sm font-medium group-hover:underline"
                  style={{ color: c.color }}
                >
                  {c.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 glow-card rounded-sm p-6">
          <p className="font-mono text-[10px] text-[var(--neon)] tracking-widest mb-2 uppercase">
            Юридическое лицо
          </p>
          <p className="text-[#5a7080] text-sm leading-relaxed">
            ООО «ФлэшМит» · ОГРН 0000000000000 · ИНН 000000000000
            <br />
            Юридический адрес: г. Москва, ул. Примерная, д. 1, офис 101
            <br />
            Режим работы поддержки: пн–пт 10:00–19:00 МСК
          </p>
        </div>
      </div>
    </div>
  );
}
