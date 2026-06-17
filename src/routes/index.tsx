import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Mail,
  Copy,
  Check,
  RefreshCw,
  RotateCcw,
  Trash2,
  Inbox,
  ShieldCheck,
  Lock,
  Zap,
  Sparkles,
  ArrowLeft,
  Globe,
  Clock,
} from "lucide-react";
import {
  createAccount,
  deleteAccount,
  deleteMessage,
  getMessage,
  listMessages,
  type MailAccount,
  type MessageDetail,
  type MessageSummary,
} from "@/lib/mailtm";
import { translations, type Lang } from "@/lib/i18n";
import { AdSlot } from "@/components/AdSlot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GMO MAIL — بريد مؤقت آمن | Free Temporary Email" },
      {
        name: "description",
        content:
          "GMO MAIL: بريد إلكتروني مؤقت مجاني وآمن لاستقبال الرسائل وحماية خصوصيتك. Free, secure temporary email — no sign-up required.",
      },
      { property: "og:title", content: "GMO MAIL — Temporary Email" },
      {
        property: "og:description",
        content: "Free secure disposable email to protect your privacy. بريد مؤقت آمن ومجاني.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const STORAGE_KEY = "gmo_mail_account";

function Index() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = translations[lang];

  const [account, setAccount] = useState<MailAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<MessageSummary[]>([]);
  const [openMsg, setOpenMsg] = useState<MessageDetail | null>(null);
  const accountRef = useRef<MailAccount | null>(null);

  const setAndStore = useCallback((acc: MailAccount | null) => {
    accountRef.current = acc;
    setAccount(acc);
    if (typeof window !== "undefined") {
      if (acc) localStorage.setItem(STORAGE_KEY, JSON.stringify(acc));
      else localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const newAccount = useCallback(async () => {
    setError(null);
    setLoading(true);
    setMessages([]);
    setOpenMsg(null);
    try {
      const acc = await createAccount();
      setAndStore(acc);
    } catch (e) {
      console.error("createAccount failed", e);
      setError(t.errorCreate);
    } finally {
      setLoading(false);
    }
  }, [setAndStore, t.errorCreate]);

  // bootstrap: reuse stored account or create new (guarded against double-run)
  const bootstrapped = useRef(false);
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    (async () => {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        try {
          const acc = JSON.parse(stored) as MailAccount;
          await listMessages(acc.token);
          accountRef.current = acc;
          setAccount(acc);
          setLoading(false);
          return;
        } catch {
          /* stale account, fall through to create */
        }
      }
      await newAccount();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(async () => {
    const acc = accountRef.current;
    if (!acc) return;
    setRefreshing(true);
    try {
      const list = await listMessages(acc.token);
      setMessages(list);
    } catch {
      /* ignore transient errors */
    } finally {
      setRefreshing(false);
    }
  }, []);

  // poll inbox
  useEffect(() => {
    if (!account) return;
    refresh();
    const id = setInterval(refresh, 8000);
    return () => clearInterval(id);
  }, [account, refresh]);

  const handleCopy = async () => {
    if (!account) return;
    try {
      await navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  const handleDelete = async () => {
    if (!account) return;
    if (!window.confirm(t.confirmDelete)) return;
    const acc = account;
    setAndStore(null);
    try {
      await deleteAccount(acc.token, acc.id);
    } catch {
      /* ignore */
    }
    await newAccount();
  };

  const handleOpen = async (id: string) => {
    const acc = accountRef.current;
    if (!acc) return;
    try {
      const msg = await getMessage(acc.token, id);
      setOpenMsg(msg);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, seen: true } : m)));
    } catch {
      /* ignore */
    }
  };

  const handleDeleteMsg = async (id: string) => {
    const acc = accountRef.current;
    if (!acc) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setOpenMsg(null);
    try {
      await deleteMessage(acc.token, id);
    } catch {
      /* ignore */
    }
  };

  const trustIcons = [ShieldCheck, Lock, Zap, RefreshCw];
  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });

  return (
    <div dir={t.dir} className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
              <Mail className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-lg font-extrabold tracking-tight text-foreground">GMO MAIL</p>
              <p className="text-[11px] text-muted-foreground">{t.brandTagline}</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#how" className="transition-colors hover:text-foreground">{t.nav_how}</a>
            <a href="#trust" className="transition-colors hover:text-foreground">{t.nav_trust}</a>
            <a href="#faq" className="transition-colors hover:text-foreground">{t.nav_faq}</a>
          </nav>
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
          >
            <Globe className="h-4 w-4" />
            {t.langBtn}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        {/* Hero */}
        <section className="pt-10 text-center md:pt-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" /> GMO MAIL
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
            {t.heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t.heroDesc}
          </p>
        </section>

        {/* Top banner ad */}
        <div className="mt-8">
          <AdSlot label={t.adLabel} slotId="top-banner" variant="banner" />
        </div>

        {/* Email card */}
        <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-card md:p-7">
          <p className="text-sm font-semibold text-muted-foreground">{t.yourEmail}</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-gradient-soft px-4 py-4">
              <Mail className="h-5 w-5 shrink-0 text-brand-deep" />
              <span className="flex-1 select-all break-all text-base font-bold text-foreground md:text-xl" dir="ltr">
                {loading ? t.creating : account?.address}
              </span>
              <button
                onClick={handleCopy}
                disabled={!account}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-50"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? t.copied : t.copy}
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <button
              onClick={refresh}
              disabled={!account}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin-slow" : ""}`} />
              {t.refresh}
            </button>
            <button
              onClick={newAccount}
              disabled={loading}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              {t.change}
            </button>
            <button
              onClick={handleDelete}
              disabled={!account}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {t.delete}
            </button>
          </div>
          {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}
        </section>

        {/* Inbox + sidebar ads */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="rounded-3xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
                <Inbox className="h-5 w-5 text-brand" /> {t.inbox}
                {messages.length > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    {messages.length}
                  </span>
                )}
              </h2>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {t.autoRefresh}
              </span>
            </div>

            {openMsg ? (
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => setOpenMsg(null)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4" /> {t.back}
                  </button>
                  <button
                    onClick={() => handleDeleteMsg(openMsg.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-sm font-semibold text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="h-4 w-4" /> {t.deleteMsg}
                  </button>
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{openMsg.subject || "(no subject)"}</h3>
                <p className="mt-1 text-sm text-muted-foreground" dir="ltr">
                  {openMsg.from?.name ? `${openMsg.from.name} · ` : ""}{openMsg.from?.address}
                </p>
                <div className="mt-4 max-h-[420px] overflow-auto rounded-xl bg-muted/40 p-4">
                  {openMsg.html && openMsg.html.length ? (
                    <div
                      className="prose-sm break-words text-sm text-foreground"
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: openMsg.html.join("") }}
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap break-words font-sans text-sm text-foreground">
                      {openMsg.text || openMsg.intro}
                    </pre>
                  )}
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 px-5 py-16 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
                  <Inbox className="h-7 w-7 text-brand-deep" />
                </span>
                <p className="text-sm font-medium text-foreground">
                  {loading ? t.inboxWaiting : t.inboxEmpty}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {messages.map((m) => (
                  <li key={m.id}>
                    <button
                      onClick={() => handleOpen(m.id)}
                      className="flex w-full items-start gap-3 px-5 py-4 text-start transition-colors hover:bg-accent/50 animate-fade-up"
                    >
                      <span
                        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${m.seen ? "bg-border" : "bg-primary"}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-bold text-foreground" dir="ltr">
                            {m.from?.name || m.from?.address}
                          </p>
                          <span className="shrink-0 text-xs text-muted-foreground">{fmtTime(m.createdAt)}</span>
                        </div>
                        <p className="truncate text-sm font-semibold text-foreground">{m.subject || "(no subject)"}</p>
                        <p className="truncate text-xs text-muted-foreground">{m.intro}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="flex flex-col gap-6">
            <AdSlot label={t.adLabel} slotId="sidebar-1" variant="box" />
            <AdSlot label={t.adLabel} slotId="sidebar-2" variant="box" />
          </aside>
        </section>

        {/* In-content ad */}
        <div className="mt-10">
          <AdSlot label={t.adLabel} slotId="mid-content" variant="wide" />
        </div>

        {/* How to use */}
        <section id="how" className="mt-12 scroll-mt-20">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            {t.howTitle}
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.how.map((s, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-bold text-foreground">{s.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section id="trust" className="mt-14 scroll-mt-20 rounded-3xl bg-gradient-soft p-7 md:p-10">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            {t.trustTitle}
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.trust.map((s, i) => {
              const Icon = trustIcons[i];
              return (
                <div key={i} className="rounded-2xl border border-border bg-card/80 p-5 text-center shadow-card">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-brand-deep">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-3 font-bold text-foreground">{s.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom banner ad */}
        <div className="mt-10">
          <AdSlot label={t.adLabel} slotId="bottom-banner" variant="banner" />
        </div>

        {/* FAQ */}
        <section id="faq" className="mt-12 scroll-mt-20">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            {t.faqTitle}
          </h2>
          <div className="mx-auto mt-7 grid max-w-3xl gap-3">
            {t.faq.map((f, i) => (
              <details key={i} className="group rounded-2xl border border-border bg-card p-5 shadow-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-foreground">
                  {f.q}
                  <span className="text-brand transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Footer ad */}
        <div className="mt-12">
          <AdSlot label={t.adLabel} slotId="footer-box" variant="box" />
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground">
              <Mail className="h-4 w-4" />
            </span>
            <span className="text-base font-extrabold text-foreground">GMO MAIL</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">{t.footerNote}</p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GMO MAIL — {t.footer}
          </p>
        </div>
      </footer>
    </div>
  );
}
