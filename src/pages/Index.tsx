import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "offer" | "privacy" | "b2b" | "contacts";

const NAV_LINKS: { id: Page; label: string }[] = [
  { id: "offer", label: "Публичная оферта" },
  { id: "privacy", label: "Политика конфиденциальности" },
  { id: "b2b", label: "B2B-оферта" },
  { id: "contacts", label: "Контакты" },
];

export default function Index() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="noise min-h-screen bg-[var(--surface)] font-plex">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--grid-line)] backdrop-blur-md bg-[rgba(11,15,23,0.85)]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setPage("home")}
            className="font-oswald text-lg font-semibold tracking-widest neon-text hover:opacity-80 transition-opacity"
          >
            FLASH<span className="text-white">MEET</span>
          </button>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => setPage(l.id)}
                className={`text-xs tracking-wide transition-colors ${
                  page === l.id
                    ? "neon-text font-medium"
                    : "text-[#5a7080] hover:text-[#90a8b8]"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          {/* Mobile menu */}
          <div className="md:hidden flex gap-3">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => setPage(l.id)}
                className={`text-[10px] tracking-wide transition-colors ${
                  page === l.id ? "neon-text" : "text-[#5a7080]"
                }`}
              >
                {l.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Pages */}
      {page === "home" && <HomePage onDoc={(id) => setPage(id)} />}
      {page === "offer" && <DocPage title="Публичная оферта" content={OFFER_CONTENT} onBack={() => setPage("home")} />}
      {page === "privacy" && <DocPage title="Политика конфиденциальности" content={PRIVACY_CONTENT} onBack={() => setPage("home")} />}
      {page === "b2b" && <DocPage title="B2B-оферта" content={B2B_CONTENT} onBack={() => setPage("home")} />}
      {page === "contacts" && <ContactsPage onBack={() => setPage("home")} />}
    </div>
  );
}

/* ─────────────────────── HOME ─────────────────────── */
function HomePage({ onDoc }: { onDoc: (id: Page) => void }) {
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
          Встречайтесь с незнакомцами безопасно.
          <br />
          Фоновый GPS, SOS-протокол и умный мэтчинг — в одном Telegram-боте.
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

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-24">
        <div className="text-center mb-12">
          <p className="font-mono text-xs text-[#2e4a58] tracking-widest uppercase mb-2">Система безопасности</p>
          <h2 className="font-oswald text-3xl md:text-4xl font-semibold text-white tracking-wide">
            Протоколы защиты
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "MapPin",
              color: "var(--neon)",
              title: "Фоновый GPS",
              desc: "Координаты скрыты от собеседника. Бот пишет точку раз в 2–3 минуты незаметно для всех.",
            },
            {
              icon: "AlertTriangle",
              color: "var(--sos)",
              title: "SOS-протокол",
              desc: "Нажми кнопку — сигнал уйдёт охране заведения и веерно ближайшим людям в радиусе 5 км.",
            },
            {
              icon: "Shield",
              color: "#6b9fff",
              title: "Анти-ОПГ",
              desc: "Из случайных резерв-людей автоматически исключаются участники и организатор встречи.",
            },
            {
              icon: "Building2",
              color: "var(--neon)",
              title: "CRM для бизнеса",
              desc: "Заведения и блогеры управляют командой, привязывают сотрудников и получают SOS-пакеты.",
            },
            {
              icon: "Users",
              color: "#b06bff",
              title: "Три вкладки поиска",
              desc: "Люди, Заведения и Мероприятия. Для массовых встреч — подтверждение участия за 30 минут.",
            },
            {
              icon: "Clock",
              color: "#ffd86b",
              title: "Таймер «Всё ок»",
              desc: "Автоматический контроль. Не ответил — запускается SOS. Можно отключить в режиме Чемпиона.",
            },
          ].map((f) => (
            <div key={f.title} className="glow-card rounded-sm p-6">
              <div
                className="w-9 h-9 rounded-sm flex items-center justify-center mb-4"
                style={{ background: `rgba(${hexToRgb(f.color)}, 0.12)` }}
              >
                <Icon name={f.icon} size={18} style={{ color: f.color }} />
              </div>
              <h3 className="font-oswald text-base font-medium text-white tracking-wide mb-2">{f.title}</h3>
              <p className="text-[#5a7080] text-sm leading-relaxed">{f.desc}</p>
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

/* ─────────────────────── DOC PAGE ─────────────────────── */
function DocPage({
  title,
  content,
  onBack,
}: {
  title: string;
  content: React.ReactNode;
  onBack: () => void;
}) {
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

        <div className="mb-8 pb-6 border-b border-[var(--grid-line)]">
          <p className="font-mono text-[10px] text-[var(--neon)] tracking-widest mb-2 uppercase">
            Юридический документ
          </p>
          <h1 className="font-oswald text-3xl md:text-4xl font-semibold text-white tracking-wide">
            {title}
          </h1>
          <p className="text-xs text-[#2e4a58] font-mono mt-2">
            Редакция: 01 января 2025 г.
          </p>
        </div>

        <div className="doc-content">{content}</div>

        <div className="mt-12 pt-6 border-t border-[var(--grid-line)]">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs text-[#3a5060] hover:text-[var(--neon)] transition-colors font-mono tracking-widest"
          >
            <Icon name="ChevronLeft" size={14} />
            НА ГЛАВНУЮ
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── CONTACTS ─────────────────────── */
function ContactsPage({ onBack }: { onBack: () => void }) {
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

/* ─────────────────────── CONTENT ─────────────────────── */
const OFFER_CONTENT = (
  <>
    <h2>1. Общие положения</h2>
    <p>
      Настоящий документ является публичной офертой ООО «ФлэшМит» (далее — «Оператор») и определяет условия использования сервиса FlashMeet, предоставляемого через Telegram-бот @FlashMeet_bot и связанную веб-инфраструктуру.
    </p>
    <p>
      Акцептом оферты считается начало использования сервиса, в том числе выполнение команды /start в Telegram-боте. С момента акцепта между Пользователем и Оператором заключается договор на изложенных условиях.
    </p>

    <h2>2. Предмет оферты</h2>
    <p>
      Оператор предоставляет Пользователю доступ к платформе организации кратких встреч между людьми с использованием технологий геолокации, анонимного мэтчинга и протокола экстренного реагирования (далее — «SOS-протокол»).
    </p>

    <h2>3. Фоновый GPS и обработка геоданных</h2>
    <p>
      После подтверждённого мэтча Пользователю предлагается активировать функцию «Live Location» — передачу координат боту FlashMeet. Данная функция активируется исключительно на добровольной основе через стандартный интерфейс Telegram.
    </p>
    <p>
      Координаты хранятся в зашифрованной базе данных и обновляются с интервалом 2–3 минуты. <strong className="text-[#90a8b8]">Координаты Пользователя не передаются собеседнику</strong> ни при каких обстоятельствах, за исключением случаев активации SOS-протокола.
    </p>
    <p>
      <strong className="text-[var(--sos)]">Дисклеймер о точности GPS:</strong> В условиях плотной городской застройки, при наличии глушащего оборудования или ограничений сигнала точность определения координат может составлять от 5 до 500 метров и более. Оператор не несёт ответственности за неточность координат, обусловленную техническими ограничениями сети и оборудования.
    </p>

    <h2>4. SOS-протокол и рассылка экстренных сигналов</h2>
    <p>
      При активации SOS-кнопки или истечении таймера «Со мной всё ок» система последовательно выполняет:
    </p>
    <ul>
      <li>Направляет экстренный пакет охране заведения (при нахождении в категории «Заведения» или на ивенте Блогера) — таймер реакции 30 секунд;</li>
      <li>При отсутствии подтверждения охраной — переходит в режим «Резерв»: веерная рассылка трём ближайшим пользователям в радиусе 5 км;</li>
      <li>Цепочка расширяется до подтверждения сбора тремя независимыми лицами.</li>
    </ul>
    <p>
      Из пула случайных получателей SOS автоматически исключаются организатор встречи и все её подтверждённые участники. Данная мера предотвращает возможность сговора третьих лиц (анти-ОПГ фильтр).
    </p>
    <p>
      Оператор не гарантирует своевременное реагирование случайных пользователей и не несёт ответственности за действия или бездействие лиц, получивших SOS-пакет.
    </p>

    <h2>5. Ограничение слотов для заведений</h2>
    <p>
      Пользователи с ролью «Заведение» вправе иметь не более одного активного предложения одновременно. Все незакрытые предложения заведений автоматически удаляются ежедневно в 07:00 по московскому времени.
    </p>

    <h2>6. Возрастное ограничение</h2>
    <p>
      Использование сервиса разрешено лицам, достигшим 18 лет. При указании возраста менее 18 лет система автоматически блокирует доступ к функциям мэтчинга.
    </p>

    <h2>7. Ответственность сторон</h2>
    <p>
      Оператор не является организатором встреч и не несёт ответственности за действия Пользователей при личных встречах. Сервис предоставляется «как есть» (as is). Ограничение ответственности Оператора составляет сумму, уплаченную Пользователем за использование сервиса за последние 30 дней.
    </p>

    <h2>8. Изменение условий</h2>
    <p>
      Оператор вправе в одностороннем порядке изменять условия оферты с уведомлением Пользователей через Telegram-бот не менее чем за 7 календарных дней.
    </p>
  </>
);

const PRIVACY_CONTENT = (
  <>
    <h2>1. Введение</h2>
    <p>
      Настоящая Политика конфиденциальности описывает порядок сбора, хранения, использования и передачи персональных данных Пользователей сервиса FlashMeet в соответствии с требованиями Федерального закона № 152-ФЗ «О персональных данных».
    </p>

    <h2>2. Собираемые данные</h2>
    <p>При использовании сервиса Оператор обрабатывает следующие категории данных:</p>
    <ul>
      <li><strong className="text-[#90a8b8]">Идентификационные:</strong> уникальный Telegram User ID (числовой идентификатор); имя и пол, указанные при регистрации;</li>
      <li><strong className="text-[#90a8b8]">Демографические:</strong> возраст и предпочтения по поиску;</li>
      <li><strong className="text-[#90a8b8]">Геолокационные:</strong> координаты GPS, передаваемые добровольно через Live Location в период активной сессии встречи (интервал записи: 2–3 минуты);</li>
      <li><strong className="text-[#90a8b8]">Контактные (добровольно):</strong> никнейм экстренного контакта в формате @username;</li>
      <li><strong className="text-[#90a8b8]">Поведенческие:</strong> история мэтчей, статусы SOS-событий, временные метки активности.</li>
    </ul>

    <h2>3. Фоновый GPS — правовые основания</h2>
    <p>
      Геолокационные данные обрабатываются исключительно на основании явного согласия Пользователя (п. 1 ч. 1 ст. 6 ФЗ-152). Активация функции Live Location через интерфейс Telegram является однозначным выражением такого согласия.
    </p>
    <p>
      Координаты <strong className="text-[#90a8b8]">не передаются</strong>: собеседнику, третьим лицам, рекламным сетям. Исключение — активация SOS-протокола, при которой зашифрованный пакет с примерными координатами направляется указанным в п. 4 Оферты получателям с единственной целью обеспечения безопасности.
    </p>
    <p>
      <strong className="text-[var(--sos)]">Важно:</strong> Точность GPS-координат в городской среде с плотной застройкой и при наличии устройств радиоэлектронного подавления (глушилок) может быть существенно снижена. Оператор фиксирует данные, получаемые от устройства Пользователя, без возможности коррекции погрешности.
    </p>

    <h2>4. Хранение данных</h2>
    <p>
      Данные хранятся на серверах, расположенных на территории Российской Федерации. Срок хранения геолокационных данных — не более 72 часов с момента последней записи. Профильные данные хранятся до удаления аккаунта. Данные SOS-событий хранятся 90 дней в целях проверки при обращениях правоохранительных органов.
    </p>

    <h2>5. Права субъекта данных</h2>
    <p>Пользователь вправе в любой момент:</p>
    <ul>
      <li>Получить сведения об обрабатываемых данных (запрос на safety@flashmeet.app);</li>
      <li>Потребовать исправления или удаления данных;</li>
      <li>Отозвать согласие на обработку геолокации, отключив Live Location в настройках Telegram;</li>
      <li>Удалить аккаунт командой /delete в боте.</li>
    </ul>

    <h2>6. Безопасность</h2>
    <p>
      Для защиты данных применяются: шифрование базы данных (AES-256), TLS 1.3 при передаче данных, разграничение доступа, регулярный аудит безопасности.
    </p>

    <h2>7. Cookies и аналитика</h2>
    <p>
      Веб-сайт FlashMeet использует технические cookie и сервис Яндекс.Метрика исключительно для анализа трафика в агрегированном виде без идентификации личности.
    </p>
  </>
);

const B2B_CONTENT = (
  <>
    <h2>1. Предмет B2B-договора</h2>
    <p>
      Настоящая оферта адресована юридическим лицам и индивидуальным предпринимателям, желающим получить коммерческий доступ к платформе FlashMeet в роли «Заведение», «Блогер» или «Гид» (далее — «Партнёр»).
    </p>

    <h2>2. Коммерческие роли</h2>
    <ul>
      <li><strong className="text-[#90a8b8]">Заведение (Бизнес):</strong> кафе, бары, клубы, коворкинги и иные площадки. Право на 1 активный слот с предложением встречи одновременно. Автоматическое удаление слота в 07:00 МСК.</li>
      <li><strong className="text-[#90a8b8]">Блогер:</strong> контент-мейкеры, организующие тематические встречи. Мероприятия маркируются 🟦. SOS-пакеты направляются назначенной охране.</li>
      <li><strong className="text-[#90a8b8]">Гид:</strong> туристические туры и городские экскурсии. Размещение в разделе «Мероприятия».</li>
    </ul>

    <h2>3. CRM-кабинет и управление командой</h2>
    <p>
      Каждый Партнёр получает доступ к личному кабинету с функциями:
    </p>
    <ul>
      <li>Генерация уникальных глубоких ссылок вида <span className="font-mono text-[var(--neon)] text-xs">t.me/FlashMeet_bot?start=staff_[HASH]</span> для привязки сотрудников;</li>
      <li>Автоматическая аннуляция ссылки после первого использования; привязанный сотрудник включается в БД команды;</li>
      <li>Уведомления владельца о каждом новом сотруднике;</li>
      <li>Мгновенное отключение сотрудника от SOS-пакетов одной кнопкой «❌ Удалить из команды».</li>
    </ul>

    <h2>4. SOS-протокол для Партнёров</h2>
    <p>
      При активации SOS на площадке Партнёра его назначенная охрана получает приоритетный пакет с примерными координатами и таймером реакции 30 секунд. При отсутствии реакции охраны система фиксирует лог просрочки и автоматически переключается на веерную рассылку (Резерв).
    </p>
    <p>
      <strong className="text-[var(--sos)]">Партнёр несёт ответственность</strong> за надлежащее ознакомление своих сотрудников с порядком реагирования на SOS-пакеты.
    </p>

    <h2>5. Ограничения и правила платформы</h2>
    <ul>
      <li>Одновременно может быть активно не более 1 предложения от одного заведения;</li>
      <li>Запрещено создание встреч с заведомо дискриминационным содержанием;</li>
      <li>Все активности заведения могут быть проверены Оператором по запросу;</li>
      <li>Оператор вправе приостановить аккаунт Партнёра при нарушении правил без возврата стоимости тарифного периода.</li>
    </ul>

    <h2>6. Тарифы и оплата</h2>
    <p>
      Стоимость коммерческого доступа определяется в соответствии с действующим прайс-листом, размещённым в Telegram-боте. Оплата производится в соответствии с выставленным счётом. Все суммы указаны с учётом НДС.
    </p>

    <h2>7. Конфиденциальность данных команды</h2>
    <p>
      Telegram ID сотрудников, привязанных к аккаунту Партнёра, хранятся в зашифрованном виде. Партнёр обязан получить согласие сотрудников на обработку их данных в рамках платформы FlashMeet до привязки их аккаунтов.
    </p>

    <h2>8. Акцепт и заключение договора</h2>
    <p>
      Акцептом настоящей B2B-оферты является оплата первого счёта или активация коммерческой роли в боте. Договор считается заключённым с момента акцепта.
    </p>

    <h2>9. Реквизиты Оператора</h2>
    <p>
      ООО «ФлэшМит» · ОГРН 0000000000000 · ИНН 000000000000
      <br />
      Адрес: г. Москва, ул. Примерная, д. 1 · b2b@flashmeet.app
    </p>
  </>
);

/* ─────────────────────── UTIL ─────────────────────── */
function hexToRgb(color: string): string {
  if (color.startsWith("var(")) {
    if (color.includes("--neon)")) return "0, 229, 192";
    if (color.includes("--sos)")) return "255, 59, 92";
    return "107, 159, 255";
  }
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

const NAV_LINKS: { id: Page; label: string }[] = [
  { id: "offer", label: "Публичная оферта" },
  { id: "privacy", label: "Политика конфиденциальности" },
  { id: "b2b", label: "B2B-оферта" },
  { id: "contacts", label: "Контакты" },
];