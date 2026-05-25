import { useState } from "react";
import Icon from "@/components/ui/icon";
import { type Page, NAV_LINKS } from "@/components/flashmeet/types";
import HomePage from "@/components/flashmeet/HomePage";
import { DocPage, OFFER_CONTENT, PRIVACY_CONTENT, B2B_CONTENT } from "@/components/flashmeet/DocPage";
import ContactsPage from "@/components/flashmeet/ContactsPage";

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
