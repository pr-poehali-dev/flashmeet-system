import Icon from "@/components/ui/icon";
import { type Page, NAV_LINKS } from "./types";

const MEET_TAGS = [
  { emoji: "🍖", label: "Мангал" },
  { emoji: "🍷", label: "По бокальчику" },
  { emoji: "🏍️", label: "Мотоциклы" },
  { emoji: "🎲", label: "Настолки" },
  { emoji: "☕", label: "Кофе" },
  { emoji: "🚶‍♂️", label: "Прогулка" },
  { emoji: "🎒", label: "Экскурсия" },
];

const SOS_STEPS = [
  {
    icon: "Heart",
    color: "var(--neon)",
    title: "Мэтч подтверждён",
    desc: 'Автор встречи нажал "✅ Да, супер!" — и прямо здесь бот просит обоих участников указать доверенное лицо.',
  },
  {
    icon: "UserCheck",
    color: "#6b9fff",
    title: "Хранитель привязан",
    desc: "Укажи @username друга. Если он уже в боте — привязывается мгновенно. Если нет — получит реферальную ссылку-приглашение.",
  },
  {
    icon: "MapPin",
    color: "#b06bff",
    title: "GPS-защита активна",
    desc: "Бот отслеживает твою Live Location в фоне. Организаторы встречи и её участники из SOS-рассылки исключаются автоматически (алгоритм Анти-ОПГ).",
  },
  {
    icon: "AlertTriangle",
    color: "var(--sos)",
    title: "SOS — веерный пуш",
    desc: 'При нажатии "🚨 SOS" или срабатывании таймера "Со мной всё ок" — охрана заведения (30 сек) → 3 случайных пользователя в радиусе 5 км.',
  },
];

const PLANS = [
  {
    id: "day",
    label: "1 День",
    rub: "190 ₽",
    stars: "130 ⭐",
    note: "Пробный запуск",
  },
  {
    id: "week",
    label: "1 Неделя",
    rub: "790 ₽",
    stars: "550 ⭐",
    note: "Популярный",
    highlight: true,
  },
  {
    id: "month",
    label: "1 Месяц",
    rub: "2 490 ₽",
    stars: "1 750 ⭐",
    note: "Выгоднее всего",
  },
];

export default function HomePage({ onDoc }: { onDoc: (id: Page) => void }) {
  return (
    <main className="grid-bg min-h-screen pt-14 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--neon)] opacity-[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute top-48 right-0 w-[300px] h-[300px] rounded-full bg-[var(--sos)] opacity-[0.04] blur-[90px]" />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[92vh] text-center px-4">
        <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,229,192,0.2)] bg-[var(--neon-dim)] text-xs font-mono tracking-widest neon-text">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] animate-blink" />
          GPS-ЗАЩИТА АКТИВНА
        </div>

        <h1 className="animate-fade-in-up delay-100 font-oswald font-bold text-[clamp(3rem,10vw,8rem)] leading-[0.9] tracking-tight mb-6">
          <span className="block text-white">FLASH</span>
          <span className="block neon-text" style={{ textShadow: "0 0 40px rgba(0,229,192,0.4)" }}>
            MEET
          </span>
        </h1>

        <p className="animate-fade-in-up delay-200 text-[#5a7080] text-base md:text-lg max-w-xl leading-relaxed mb-10">
          Быстрые встречи, без нудной переписки — здесь и сейчас.
        </p>

        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 items-center mb-16">
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

        <div className="animate-fade-in-up delay-400 w-full max-w-2xl">
          <p className="font-mono text-[10px] text-[#2e4a58] tracking-widest uppercase mb-5">
            Популярные форматы встреч
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {MEET_TAGS.map((tag, i) => (
              <div
                key={tag.label}
                className="group flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,229,192,0.12)] bg-[var(--surface-2)] hover:border-[rgba(0,229,192,0.35)] hover:bg-[var(--neon-dim)] transition-all cursor-default"
                style={{ animationDelay: `${0.4 + i * 0.06}s` }}
              >
                <span className="text-base leading-none">{tag.emoji}</span>
                <span className="font-plex text-xs text-[#5a7080] group-hover:text-[var(--neon)] transition-colors tracking-wide">
                  {tag.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOS Flow */}
      <section className="relative z-10 py-20 px-4 border-t border-[var(--grid-line)]">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] text-[var(--neon)] tracking-widest uppercase mb-3 text-center">
            Как работает защита
          </p>
          <h2 className="font-oswald text-2xl md:text-3xl font-semibold text-white tracking-wide text-center mb-12">
            SOS-протокол встречи
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SOS_STEPS.map((step, i) => (
              <div key={step.title} className="glow-card rounded-sm p-6 flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `rgba(0,0,0,0.3)`, border: `1px solid ${step.color}33` }}
                >
                  <span className="font-mono text-xs" style={{ color: step.color }}>
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon name={step.icon} size={14} style={{ color: step.color }} />
                    <p className="text-sm font-medium text-white">{step.title}</p>
                  </div>
                  <p className="text-xs text-[#3a5060] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] font-mono text-[#2e4a58] tracking-widest mt-6">
            АЛГОРИТМ АНТИ-ОПГ · ОРГАНИЗАТОР И УЧАСТНИКИ ВСТРЕЧИ ИСКЛЮЧЕНЫ ИЗ ПУЛА SOS
          </p>
        </div>
      </section>

      {/* Organizer Role */}
      <section className="relative z-10 py-20 px-4 border-t border-[var(--grid-line)]">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] text-[#2e4a58] tracking-widest uppercase mb-3 text-center">
            Для бизнеса и блогеров
          </p>
          <h2 className="font-oswald text-2xl md:text-3xl font-semibold text-white tracking-wide text-center mb-4">
            Роль Организатора
          </h2>
          <p className="text-[#5a7080] text-sm text-center max-w-xl mx-auto mb-10 leading-relaxed">
            Кафе, бар, коворкинг, блогер или гид — теперь это единая роль <span className="text-[var(--neon)] font-mono">organizer</span> с двумя форматами размещения.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="glow-card rounded-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏢</span>
                <p className="font-oswald text-lg text-white tracking-wide">Заведение</p>
              </div>
              <p className="text-xs text-[#3a5060] leading-relaxed">
                Кафе, бар, клуб, коворкинг. Активный слот появляется в ленте поиска. Ежедневная автоочистка в 07:00 МСК.
              </p>
            </div>
            <div className="glow-card rounded-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🎒</span>
                <p className="font-oswald text-lg text-white tracking-wide">Событие</p>
              </div>
              <p className="text-xs text-[#3a5060] leading-relaxed">
                Тур, экскурсия, авторская встреча от блогера. Размещается в разделе «Мероприятия» с маркером 🟦.
              </p>
            </div>
          </div>

          <div className="glow-card rounded-sm p-5 flex flex-wrap gap-6 items-center justify-between">
            <div className="flex items-start gap-3">
              <Icon name="Edit3" size={16} style={{ color: "var(--neon)" }} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-white font-medium mb-0.5">Редактирование слота</p>
                <p className="text-xs text-[#3a5060]">Меняй текст и теги активного предложения прямо из CRM-кабинета на лету.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="Bookmark" size={16} style={{ color: "#6b9fff" }} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-white font-medium mb-0.5">Мои шаблоны</p>
                <p className="text-xs text-[#3a5060]">Сохрани текст предложения и публикуй в 1 клик после утренней очистки в 07:00.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="Users" size={16} style={{ color: "#b06bff" }} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-white font-medium mb-0.5">Команда охраны</p>
                <p className="text-xs text-[#3a5060]">Генерируй одноразовые ссылки для персонала. Удаляй доступ одной кнопкой.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 py-20 px-4 border-t border-[var(--grid-line)]">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-[10px] text-[#2e4a58] tracking-widest uppercase mb-3 text-center">
            Тарифы Организатора
          </p>
          <h2 className="font-oswald text-2xl md:text-3xl font-semibold text-white tracking-wide text-center mb-2">
            1 аккаунт = 1 активный слот
          </h2>
          <p className="text-[#5a7080] text-xs text-center font-mono mb-10">
            Оплата через Робокассу (₽) или Telegram Stars (⭐)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`glow-card rounded-sm p-6 flex flex-col gap-3 relative ${plan.highlight ? "ring-1 ring-[rgba(0,229,192,0.3)]" : ""}`}
              >
                {plan.highlight && (
                  <span className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[var(--neon)] text-[var(--surface)] font-mono text-[9px] tracking-widest rounded-b-sm">
                    ПОПУЛЯРНЫЙ
                  </span>
                )}
                <p className="font-oswald text-lg text-white tracking-wide">{plan.label}</p>
                <div>
                  <p className="text-2xl font-oswald font-bold neon-text">{plan.rub}</p>
                  <p className="text-xs text-[#3a5060] font-mono mt-0.5">{plan.stars} · Telegram</p>
                </div>
                <p className="text-[10px] text-[#2e4a58] font-mono tracking-widest uppercase">{plan.note}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] font-mono text-[#2e4a58] tracking-widest mt-6">
            НДС НЕ ОБЛАГАЕТСЯ · ПСН / УСН · ПОДРОБНЕЕ В{" "}
            <button onClick={() => onDoc("b2b")} className="text-[var(--neon)] hover:underline">
              B2B-ОФЕРТЕ
            </button>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--grid-line)] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-oswald text-sm font-medium tracking-widest text-[#2e4a58]">
            FLASH<span className="text-[#3a5060]">MEET</span> © 2026
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
