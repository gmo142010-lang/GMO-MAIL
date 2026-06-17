import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as RotateCcw, c as Lock, d as Copy, f as Clock, i as ShieldCheck, l as Inbox, m as ArrowLeft, n as Trash2, o as RefreshCw, p as Check, r as Sparkles, s as Mail, t as Zap, u as Globe } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-R8wBCnNy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BASE = "https://api.mail.tm";
function randomString(len) {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	let out = "";
	const arr = new Uint32Array(len);
	crypto.getRandomValues(arr);
	for (let i = 0; i < len; i++) out += chars[arr[i] % 36];
	return out;
}
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(path, options = {}, token, attempt = 0) {
	const res = await fetch(`${BASE}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			...token ? { Authorization: `Bearer ${token}` } : {},
			...options.headers || {}
		}
	});
	if (res.status === 429 && attempt < 4) {
		await sleep(1200 * (attempt + 1));
		return api(path, options, token, attempt + 1);
	}
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`mail.tm ${res.status}: ${body}`);
	}
	if (res.status === 204) return null;
	return res.json();
}
async function getDomains() {
	const data = await api("/domains?page=1");
	const members = data?.["hydra:member"] ?? data?.member ?? (Array.isArray(data) ? data : []);
	const active = members.filter((d) => d?.isActive !== false && d?.isPrivate !== true);
	return (active.length ? active : members).map((d) => d.domain).filter(Boolean);
}
async function createAccount() {
	const domains = await getDomains();
	if (!domains.length) throw new Error("no-domains");
	const domain = domains[0];
	const password = randomString(14);
	let lastErr;
	for (let i = 0; i < 3; i++) {
		const address = `${randomString(10)}@${domain}`;
		try {
			await api("/accounts", {
				method: "POST",
				body: JSON.stringify({
					address,
					password
				})
			});
			const tokenRes = await api("/token", {
				method: "POST",
				body: JSON.stringify({
					address,
					password
				})
			});
			return {
				id: tokenRes.id,
				address,
				password,
				token: tokenRes.token
			};
		} catch (e) {
			lastErr = e;
			await sleep(600);
		}
	}
	throw lastErr instanceof Error ? lastErr : /* @__PURE__ */ new Error("create-failed");
}
async function listMessages(token) {
	return (await api("/messages?page=1", {}, token))["hydra:member"] || [];
}
async function getMessage(token, id) {
	return api(`/messages/${id}`, {}, token);
}
async function deleteMessage(token, id) {
	await api(`/messages/${id}`, { method: "DELETE" }, token);
}
async function deleteAccount(token, id) {
	await api(`/accounts/${id}`, { method: "DELETE" }, token);
}
var translations = {
	ar: {
		dir: "rtl",
		brandTagline: "بريد مؤقت سريع وآمن ومجاني",
		nav_how: "طريقة الاستخدام",
		nav_trust: "لماذا نحن",
		nav_faq: "أسئلة شائعة",
		langBtn: "English",
		heroTitle: "بريد إلكتروني مؤقت بنقرة واحدة",
		heroDesc: "احصل على عنوان بريد وهمي فوري لاستقبال رسائل التفعيل والتسجيل دون كشف بريدك الحقيقي. بدون تسجيل، بدون كلمات مرور، ومحمي بالكامل.",
		yourEmail: "عنوان بريدك المؤقت",
		creating: "جارٍ إنشاء عنوان...",
		copy: "نسخ",
		copied: "تم النسخ!",
		refresh: "تحديث",
		change: "تغيير",
		delete: "حذف",
		inbox: "صندوق الوارد",
		inboxWaiting: "في انتظار الرسائل...",
		inboxEmpty: "لا توجد رسائل بعد. الرسائل ستظهر هنا تلقائياً.",
		autoRefresh: "تحديث تلقائي كل 8 ثوانٍ",
		from: "من",
		subject: "الموضوع",
		time: "الوقت",
		back: "رجوع",
		deleteMsg: "حذف الرسالة",
		confirmDelete: "هل تريد حذف هذا العنوان وإنشاء عنوان جديد؟ ستفقد جميع الرسائل.",
		howTitle: "كيف تستخدم بريدك المؤقت؟",
		how: [
			{
				t: "انسخ العنوان",
				d: "اضغط زر النسخ لنسخ عنوان البريد المؤقت الظاهر أعلى الصفحة."
			},
			{
				t: "استخدمه للتسجيل",
				d: "الصقه في أي موقع يطلب بريداً إلكترونياً للتسجيل أو التفعيل."
			},
			{
				t: "استقبل الرسالة",
				d: "ستصل الرسالة خلال ثوانٍ وتظهر في صندوق الوارد تلقائياً."
			},
			{
				t: "غيّر أو احذف",
				d: "اضغط تغيير لعنوان جديد، أو حذف لمسح كل شيء فوراً."
			}
		],
		trustTitle: "موقع مضمون وموثوق",
		trust: [
			{
				t: "خصوصية كاملة",
				d: "لا نطلب أي بيانات شخصية ولا نحفظ هويتك. بريدك المؤقت مجهول تماماً."
			},
			{
				t: "حماية من السبام",
				d: "احمِ بريدك الحقيقي من الرسائل المزعجة والإعلانات غير المرغوبة."
			},
			{
				t: "سريع ومجاني",
				d: "بدون رسوم وبدون حدود. عنوان جاهز فوراً في أي وقت."
			},
			{
				t: "حذف تلقائي",
				d: "تُحذف الرسائل والعناوين تلقائياً لضمان أمانك الكامل."
			}
		],
		faqTitle: "الأسئلة الشائعة",
		faq: [
			{
				q: "هل البريد المؤقت آمن؟",
				a: "نعم، عنوانك مجهول ولا يرتبط بأي بيانات شخصية، والرسائل تُحذف تلقائياً."
			},
			{
				q: "كم تبقى الرسائل؟",
				a: "تبقى الرسائل ما دامت الجلسة نشطة، ويمكنك حذفها أو إنشاء عنوان جديد في أي وقت."
			},
			{
				q: "هل يمكنني إرسال رسائل؟",
				a: "البريد المؤقت مخصص لاستقبال الرسائل فقط لحماية خصوصيتك."
			},
			{
				q: "هل الخدمة مجانية؟",
				a: "نعم، GMO MAIL مجاني بالكامل وبدون أي رسوم أو تسجيل."
			}
		],
		adLabel: "مساحة إعلانية",
		footer: "جميع الحقوق محفوظة",
		footerNote: "بريد مؤقت آمن لحماية خصوصيتك على الإنترنت.",
		errorCreate: "تعذر إنشاء عنوان جديد، حاول مرة أخرى."
	},
	en: {
		dir: "ltr",
		brandTagline: "Fast, secure & free temporary email",
		nav_how: "How to use",
		nav_trust: "Why us",
		nav_faq: "FAQ",
		langBtn: "العربية",
		heroTitle: "Temporary email in one click",
		heroDesc: "Get an instant disposable address to receive verification and sign-up emails without exposing your real inbox. No registration, no passwords, fully protected.",
		yourEmail: "Your temporary address",
		creating: "Creating address...",
		copy: "Copy",
		copied: "Copied!",
		refresh: "Refresh",
		change: "Change",
		delete: "Delete",
		inbox: "Inbox",
		inboxWaiting: "Waiting for messages...",
		inboxEmpty: "No messages yet. Incoming mail appears here automatically.",
		autoRefresh: "Auto-refresh every 8s",
		from: "From",
		subject: "Subject",
		time: "Time",
		back: "Back",
		deleteMsg: "Delete message",
		confirmDelete: "Delete this address and create a new one? You will lose all messages.",
		howTitle: "How to use your temp mail",
		how: [
			{
				t: "Copy the address",
				d: "Tap the copy button to copy the temporary email shown at the top."
			},
			{
				t: "Use it to sign up",
				d: "Paste it into any site that asks for an email to register or verify."
			},
			{
				t: "Receive the message",
				d: "Mail arrives within seconds and appears in your inbox automatically."
			},
			{
				t: "Change or delete",
				d: "Tap Change for a new address, or Delete to wipe everything instantly."
			}
		],
		trustTitle: "A trusted & secure service",
		trust: [
			{
				t: "Full privacy",
				d: "We never ask for personal data or store your identity. Your inbox is anonymous."
			},
			{
				t: "Spam protection",
				d: "Keep your real inbox clean from spam, ads and unwanted senders."
			},
			{
				t: "Fast & free",
				d: "No fees, no limits. A ready-to-use address whenever you need it."
			},
			{
				t: "Auto-delete",
				d: "Messages and addresses are removed automatically for your safety."
			}
		],
		faqTitle: "Frequently asked questions",
		faq: [
			{
				q: "Is temp mail safe?",
				a: "Yes, your address is anonymous, not linked to personal data, and messages auto-delete."
			},
			{
				q: "How long do messages last?",
				a: "Messages stay while your session is active; delete them or make a new address anytime."
			},
			{
				q: "Can I send emails?",
				a: "Temp mail is for receiving messages only, to protect your privacy."
			},
			{
				q: "Is the service free?",
				a: "Yes, GMO MAIL is completely free with no fees and no sign-up."
			}
		],
		adLabel: "Advertisement",
		footer: "All rights reserved",
		footerNote: "Secure temporary email to protect your privacy online.",
		errorCreate: "Could not create a new address, please try again."
	}
};
function AdSlot({ label, slotId, variant = "box" }) {
	const adRef = (0, import_react.useRef)(null);
	const isLoaded = (0, import_react.useRef)(false);
	const formats = {
		banner: "horizontal",
		box: "rectangle",
		wide: "horizontal"
	};
	(0, import_react.useEffect)(() => {
		if (isLoaded.current) return;
		isLoaded.current = true;
		if (typeof window !== "undefined" && window.adsbygoogle) try {
			window.adsbygoogle.push({});
		} catch {}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ad-slot": slotId,
		className: "flex w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 px-4 text-center",
		style: { minHeight: variant === "banner" ? 90 : variant === "wide" ? 120 : 250 },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ins", {
			ref: adRef,
			className: "adsbygoogle",
			style: {
				display: "block",
				width: "100%",
				minHeight: variant === "banner" ? 90 : variant === "wide" ? 120 : 250
			},
			"data-ad-client": "ca-pub-9511146548470420",
			"data-ad-slot": slotId,
			"data-ad-format": formats[variant],
			"data-full-width-responsive": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("noscript", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground/70",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[11px] text-muted-foreground/50",
				children: ["AdSense · ", slotId]
			})]
		}) })]
	});
}
var STORAGE_KEY = "gmo_mail_account";
function Index() {
	const [lang, setLang] = (0, import_react.useState)("ar");
	const t = translations[lang];
	const [account, setAccount] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [openMsg, setOpenMsg] = (0, import_react.useState)(null);
	const accountRef = (0, import_react.useRef)(null);
	const setAndStore = (0, import_react.useCallback)((acc) => {
		accountRef.current = acc;
		setAccount(acc);
		if (typeof window !== "undefined") if (acc) localStorage.setItem(STORAGE_KEY, JSON.stringify(acc));
		else localStorage.removeItem(STORAGE_KEY);
	}, []);
	const newAccount = (0, import_react.useCallback)(async () => {
		setError(null);
		setLoading(true);
		setMessages([]);
		setOpenMsg(null);
		try {
			setAndStore(await createAccount());
		} catch (e) {
			console.error("createAccount failed", e);
			setError(t.errorCreate);
		} finally {
			setLoading(false);
		}
	}, [setAndStore, t.errorCreate]);
	const bootstrapped = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (bootstrapped.current) return;
		bootstrapped.current = true;
		(async () => {
			const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
			if (stored) try {
				const acc = JSON.parse(stored);
				await listMessages(acc.token);
				accountRef.current = acc;
				setAccount(acc);
				setLoading(false);
				return;
			} catch {}
			await newAccount();
		})();
	}, []);
	const refresh = (0, import_react.useCallback)(async () => {
		const acc = accountRef.current;
		if (!acc) return;
		setRefreshing(true);
		try {
			setMessages(await listMessages(acc.token));
		} catch {} finally {
			setRefreshing(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!account) return;
		refresh();
		const id = setInterval(refresh, 8e3);
		return () => clearInterval(id);
	}, [account, refresh]);
	const handleCopy = async () => {
		if (!account) return;
		try {
			await navigator.clipboard.writeText(account.address);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {}
	};
	const handleDelete = async () => {
		if (!account) return;
		if (!window.confirm(t.confirmDelete)) return;
		const acc = account;
		setAndStore(null);
		try {
			await deleteAccount(acc.token, acc.id);
		} catch {}
		await newAccount();
	};
	const handleOpen = async (id) => {
		const acc = accountRef.current;
		if (!acc) return;
		try {
			setOpenMsg(await getMessage(acc.token, id));
			setMessages((prev) => prev.map((m) => m.id === id ? {
				...m,
				seen: true
			} : m));
		} catch {}
	};
	const handleDeleteMsg = async (id) => {
		const acc = accountRef.current;
		if (!acc) return;
		setMessages((prev) => prev.filter((m) => m.id !== id));
		setOpenMsg(null);
		try {
			await deleteMessage(acc.token, id);
		} catch {}
	};
	const trustIcons = [
		ShieldCheck,
		Lock,
		Zap,
		RefreshCw
	];
	const fmtTime = (iso) => new Date(iso).toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
		hour: "2-digit",
		minute: "2-digit",
		day: "2-digit",
		month: "short"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		dir: t.dir,
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-extrabold tracking-tight text-foreground",
									children: "GMO MAIL"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: t.brandTagline
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#how",
									className: "transition-colors hover:text-foreground",
									children: t.nav_how
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#trust",
									className: "transition-colors hover:text-foreground",
									children: t.nav_trust
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#faq",
									className: "transition-colors hover:text-foreground",
									children: t.nav_faq
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setLang(lang === "ar" ? "en" : "ar"),
							className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4" }), t.langBtn]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 pb-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "pt-10 text-center md:pt-14",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-accent-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " GMO MAIL"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mx-auto mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl",
								children: t.heroTitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base",
								children: t.heroDesc
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
							label: t.adLabel,
							slotId: "top-banner",
							variant: "banner"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-8 rounded-3xl border border-border bg-card p-5 shadow-card md:p-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-muted-foreground",
								children: t.yourEmail
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-col gap-3 sm:flex-row sm:items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-1 items-center gap-3 rounded-2xl bg-gradient-soft px-4 py-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-5 w-5 shrink-0 text-brand-deep" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1 select-all break-all text-base font-bold text-foreground md:text-xl",
											dir: "ltr",
											children: loading ? t.creating : account?.address
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: handleCopy,
											disabled: !account,
											className: "inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-50",
											children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), copied ? t.copied : t.copy]
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-3 gap-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: refresh,
										disabled: !account,
										className: "inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 ${refreshing ? "animate-spin-slow" : ""}` }), t.refresh]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: newAccount,
										disabled: loading,
										className: "inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), t.change]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleDelete,
										disabled: !account,
										className: "inline-flex items-center justify-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), t.delete]
									})
								]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm font-medium text-destructive",
								children: error
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-8 grid gap-6 lg:grid-cols-[1fr_300px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-border bg-card shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border px-5 py-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "flex items-center gap-2 text-base font-bold text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-5 w-5 text-brand" }),
										" ",
										t.inbox,
										messages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground",
											children: messages.length
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
										" ",
										t.autoRefresh
									]
								})]
							}), openMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setOpenMsg(null),
											className: "inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep hover:underline",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }),
												" ",
												t.back
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleDeleteMsg(openMsg.id),
											className: "inline-flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-sm font-semibold text-destructive hover:bg-destructive/20",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }),
												" ",
												t.deleteMsg
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-4 text-lg font-bold text-foreground",
										children: openMsg.subject || "(no subject)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										dir: "ltr",
										children: [openMsg.from?.name ? `${openMsg.from.name} · ` : "", openMsg.from?.address]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 max-h-[420px] overflow-auto rounded-xl bg-muted/40 p-4",
										children: openMsg.html && openMsg.html.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "prose-sm break-words text-sm text-foreground",
											dangerouslySetInnerHTML: { __html: openMsg.html.join("") }
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
											className: "whitespace-pre-wrap break-words font-sans text-sm text-foreground",
											children: openMsg.text || openMsg.intro
										})
									})
								]
							}) : messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center gap-3 px-5 py-16 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-7 w-7 text-brand-deep" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-foreground",
									children: loading ? t.inboxWaiting : t.inboxEmpty
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border",
								children: messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleOpen(m.id),
									className: "flex w-full items-start gap-3 px-5 py-4 text-start transition-colors hover:bg-accent/50 animate-fade-up",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${m.seen ? "bg-border" : "bg-primary"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate text-sm font-bold text-foreground",
													dir: "ltr",
													children: m.from?.name || m.from?.address
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "shrink-0 text-xs text-muted-foreground",
													children: fmtTime(m.createdAt)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-sm font-semibold text-foreground",
												children: m.subject || "(no subject)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-xs text-muted-foreground",
												children: m.intro
											})
										]
									})]
								}) }, m.id))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "flex flex-col gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
								label: t.adLabel,
								slotId: "sidebar-1",
								variant: "box"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
								label: t.adLabel,
								slotId: "sidebar-2",
								variant: "box"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
							label: t.adLabel,
							slotId: "mid-content",
							variant: "wide"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "how",
						className: "mt-12 scroll-mt-20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-center text-2xl font-extrabold tracking-tight text-foreground md:text-3xl",
							children: t.howTitle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
							children: t.how.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-5 shadow-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero text-sm font-bold text-primary-foreground",
										children: i + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-3 font-bold text-foreground",
										children: s.t
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-sm leading-relaxed text-muted-foreground",
										children: s.d
									})
								]
							}, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "trust",
						className: "mt-14 scroll-mt-20 rounded-3xl bg-gradient-soft p-7 md:p-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-center text-2xl font-extrabold tracking-tight text-foreground md:text-3xl",
							children: t.trustTitle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
							children: t.trust.map((s, i) => {
								const Icon = trustIcons[i];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card/80 p-5 text-center shadow-card",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-brand-deep",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-3 font-bold text-foreground",
											children: s.t
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1.5 text-sm leading-relaxed text-muted-foreground",
											children: s.d
										})
									]
								}, i);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
							label: t.adLabel,
							slotId: "bottom-banner",
							variant: "banner"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "faq",
						className: "mt-12 scroll-mt-20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-center text-2xl font-extrabold tracking-tight text-foreground md:text-3xl",
							children: t.faqTitle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mt-7 grid max-w-3xl gap-3",
							children: t.faq.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
								className: "group rounded-2xl border border-border bg-card p-5 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
									className: "flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-foreground",
									children: [f.q, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-brand transition-transform group-open:rotate-45",
										children: "+"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm leading-relaxed text-muted-foreground",
									children: f.a
								})]
							}, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
							label: t.adLabel,
							slotId: "footer-box",
							variant: "box"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-extrabold text-foreground",
								children: "GMO MAIL"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-md text-sm text-muted-foreground",
							children: t.footerNote
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" GMO MAIL — ",
								t.footer
							]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Index as component };
