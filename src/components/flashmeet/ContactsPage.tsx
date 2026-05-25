import Icon from "@/components/ui/icon";

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

        {/* Telegram */}
        <div className="mb-4">
          <p className="font-mono text-[10px] text-[#2e4a58] tracking-widest uppercase mb-3">
            01 · Официальный Telegram-бот
          </p>
          <a
            href="https://t.me/FlashMeet_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="glow-card rounded-sm p-6 flex items-start gap-4 group no-underline"
          >
            <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 mt-0.5 bg-[rgba(0,229,192,0.12)]">
              <Icon name="Send" size={18} style={{ color: "var(--neon)" }} />
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#2e4a58] tracking-widest uppercase mb-1">
                Главный бот сервиса
              </p>
              <p className="text-sm font-medium text-[var(--neon)] group-hover:underline">
                @FlashMeet_bot
              </p>
              <p className="text-xs text-[#3a5060] mt-1 leading-relaxed">
                По вопросам работы интерфейса, активации ролей или предложений — пишите напрямую в поддержку внутри бота.
              </p>
            </div>
          </a>
        </div>

        {/* Email */}
        <div className="mb-4">
          <p className="font-mono text-[10px] text-[#2e4a58] tracking-widest uppercase mb-3">
            02 · Единая служба поддержки и юридических запросов
          </p>
          <a
            href="mailto:bgs1990st@mail.ru"
            className="glow-card rounded-sm p-6 flex items-start gap-4 group no-underline"
          >
            <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 mt-0.5 bg-[rgba(107,159,255,0.12)]">
              <Icon name="Mail" size={18} style={{ color: "#6b9fff" }} />
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#2e4a58] tracking-widest uppercase mb-1">
                Единый e-mail
              </p>
              <p className="text-sm font-medium text-[#6b9fff] group-hover:underline">
                bgs1990st@mail.ru
              </p>
              <p className="text-xs text-[#3a5060] mt-1 leading-relaxed">
                Техническая поддержка · B2B-партнёрство · Конфиденциальность и безопасность данных
              </p>
            </div>
          </a>
        </div>

        {/* Реквизиты */}
        <div className="mb-4">
          <p className="font-mono text-[10px] text-[#2e4a58] tracking-widest uppercase mb-3">
            03 · Сведения об Исполнителе
          </p>
          <div className="glow-card rounded-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 mt-0.5 bg-[rgba(176,107,255,0.12)]">
                <Icon name="FileText" size={18} style={{ color: "#b06bff" }} />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-white font-medium">
                  Беломестнов Геннадий Сергеевич
                </p>
                <p className="text-xs text-[#5a7080]">Индивидуальный предприниматель</p>
                <div className="pt-1 space-y-1">
                  <p className="text-xs text-[#3a5060] font-mono">
                    ИНН: <span className="text-[#90a8b8]">751601068341</span>
                  </p>
                  <p className="text-xs text-[#3a5060] font-mono">
                    ОГРНИП: <span className="text-[#90a8b8]">323750000005231</span>
                  </p>
                  <p className="text-xs text-[#3a5060] font-mono">
                    Сайт:{" "}
                    <a
                      href="https://flashmeet.poehali.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--neon)] hover:underline"
                    >
                      flashmeet.poehali.dev
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Режим работы */}
        <div>
          <p className="font-mono text-[10px] text-[#2e4a58] tracking-widest uppercase mb-3">
            04 · Режим работы поддержки
          </p>
          <div className="glow-card rounded-sm p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 mt-0.5 bg-[rgba(255,216,107,0.1)]">
              <Icon name="Clock" size={18} style={{ color: "#ffd86b" }} />
            </div>
            <div>
              <p className="text-sm text-white font-medium mb-1">
                Пн – Пт: 10:00 – 19:00 МСК
              </p>
              <p className="text-xs text-[#3a5060] leading-relaxed">
                Запросы, поступившие в выходные дни, обрабатываются в приоритетном порядке в понедельник утром.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
