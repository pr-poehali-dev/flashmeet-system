import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface Suspect {
  id: number;
  user_ids: number[];
  lat: number;
  lon: number;
  detected_at: string;
  reviewed: boolean;
  note: string | null;
}

const ADMIN_API = import.meta.env.VITE_ADMIN_SUSPECTS_URL || "";

export default function AdminPage({ onBack }: { onBack: () => void }) {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [suspects, setSuspects] = useState<Suspect[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  async function fetchSuspects(t: string, all: boolean) {
    setLoading(true);
    setError("");
    try {
      const url = ADMIN_API + (all ? "?all=1" : "");
      const res = await fetch(url, {
        headers: { "X-Admin-Token": t },
      });
      if (res.status === 401) {
        setError("Неверный токен");
        setAuthed(false);
        return;
      }
      const data = await res.json();
      const body = typeof data === "string" ? JSON.parse(data) : data;
      setSuspects(body.suspects || []);
      setAuthed(true);
    } catch {
      setError("Ошибка соединения с бэкендом");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: number, action: "dismiss" | "ban") {
    setActionLoading(id);
    try {
      const res = await fetch(ADMIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      const body = typeof data === "string" ? JSON.parse(data) : data;
      if (body.ok) {
        setSuspects((prev) => prev.filter((s) => s.id !== id));
      }
    } finally {
      setActionLoading(null);
    }
  }

  useEffect(() => {
    if (authed) fetchSuspects(token, showAll);
  }, [showAll]);

  return (
    <div className="min-h-screen pt-14 pb-16">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs text-[#3a5060] hover:text-[var(--neon)] transition-colors mb-8 font-mono tracking-widest"
        >
          <Icon name="ChevronLeft" size={14} />
          НА ГЛАВНУЮ
        </button>

        <div className="mb-8 pb-5 border-b border-[var(--grid-line)]">
          <p className="font-mono text-[10px] text-[var(--sos)] tracking-widest mb-2 uppercase">
            Служебный раздел
          </p>
          <h1 className="font-oswald text-3xl font-semibold text-white tracking-wide flex items-center gap-3">
            <Icon name="ShieldAlert" size={28} style={{ color: "var(--sos)" }} />
            Fake Farm Suspects
          </h1>
        </div>

        {!authed ? (
          <div className="glow-card rounded-sm p-8 max-w-md">
            <p className="text-[#5a7080] text-sm mb-4">Введите admin-токен для доступа:</p>
            <div className="flex gap-3">
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchSuspects(token, showAll)}
                placeholder="admin token..."
                className="flex-1 bg-[var(--surface-3)] border border-[rgba(0,229,192,0.15)] rounded-sm px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-[var(--neon)] transition-colors"
              />
              <button
                onClick={() => fetchSuspects(token, showAll)}
                disabled={loading}
                className="px-5 py-2 bg-[var(--neon)] text-[var(--surface)] rounded-sm font-oswald text-sm font-semibold tracking-wider hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loading ? "..." : "ВОЙТИ"}
              </button>
            </div>
            {error && (
              <p className="text-[var(--sos)] text-xs mt-3 font-mono">{error}</p>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#2e4a58] tracking-widest uppercase">
                  {suspects.length} записей
                </span>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowAll((v) => !v)}>
                  <div
                    className={`w-8 h-4 rounded-full transition-colors relative ${showAll ? "bg-[var(--neon)]" : "bg-[#1e2d3a]"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${showAll ? "translate-x-4" : "translate-x-0.5"}`}
                    />
                  </div>
                  <span className="text-xs text-[#5a7080]">Показать отрецензированные</span>
                </div>
              </div>
              <button
                onClick={() => fetchSuspects(token, showAll)}
                className="inline-flex items-center gap-2 text-xs text-[#3a5060] hover:text-[var(--neon)] transition-colors font-mono"
              >
                <Icon name="RefreshCw" size={12} />
                ОБНОВИТЬ
              </button>
            </div>

            {suspects.length === 0 ? (
              <div className="glow-card rounded-sm p-10 text-center">
                <p className="text-[#2e4a58] font-mono text-sm">
                  {loading ? "Загрузка..." : "✓ Подозреваемых не обнаружено"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {suspects.map((s) => (
                  <div key={s.id} className="glow-card rounded-sm p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-[10px] text-[var(--sos)] tracking-widest">
                            #{s.id}
                          </span>
                          {s.reviewed && (
                            <span className="font-mono text-[10px] text-[#2e4a58] border border-[#2e4a58] px-2 py-0.5 rounded-full">
                              ОТРЕЦЕНЗИРОВАНО
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {s.user_ids.map((uid) => (
                            <span
                              key={uid}
                              className="font-mono text-xs bg-[var(--surface-3)] text-[#90a8b8] px-2.5 py-1 rounded-sm border border-[rgba(0,229,192,0.08)]"
                            >
                              {uid}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-[#2e4a58] font-mono">
                          <a
                            href={`https://www.google.com/maps?q=${s.lat},${s.lon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-[var(--neon)] transition-colors"
                          >
                            <Icon name="MapPin" size={11} className="inline" />
                            {s.lat.toFixed(5)}, {s.lon.toFixed(5)}
                          </a>
                          <span>
                            <Icon name="Clock" size={11} className="inline mr-1" />
                            {new Date(s.detected_at).toLocaleString("ru-RU")}
                          </span>
                        </div>
                        {s.note && (
                          <p className="mt-2 text-[#3a5060] text-xs font-mono leading-relaxed">
                            {s.note}
                          </p>
                        )}
                      </div>
                      {!s.reviewed && (
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => handleAction(s.id, "dismiss")}
                            disabled={actionLoading === s.id}
                            className="px-4 py-2 text-xs font-mono rounded-sm border border-[rgba(0,229,192,0.2)] text-[#5a7080] hover:border-[var(--neon)] hover:text-[var(--neon)] transition-all disabled:opacity-40"
                          >
                            {actionLoading === s.id ? "..." : "DISMISS"}
                          </button>
                          <button
                            onClick={() => handleAction(s.id, "ban")}
                            disabled={actionLoading === s.id}
                            className="px-4 py-2 text-xs font-mono rounded-sm bg-[var(--sos-dim)] border border-[rgba(255,59,92,0.25)] text-[var(--sos)] hover:bg-[rgba(255,59,92,0.2)] transition-all disabled:opacity-40"
                          >
                            {actionLoading === s.id ? "..." : "BAN"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}