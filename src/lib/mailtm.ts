// Lightweight client for the free mail.tm disposable email API.
// Docs: https://docs.mail.tm

const BASE = "https://api.mail.tm";

export interface MailAccount {
  id: string;
  address: string;
  password: string;
  token: string;
}

export interface MessageSummary {
  id: string;
  from: { name?: string; address: string };
  subject: string;
  intro: string;
  seen: boolean;
  createdAt: string;
}

export interface MessageDetail extends MessageSummary {
  to: { name?: string; address: string }[];
  text?: string;
  html?: string[];
}

function randomString(len: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) out += chars[arr[i] % chars.length];
  return out;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function api(path: string, options: RequestInit = {}, token?: string, attempt = 0): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  // mail.tm rate-limits with 429 — back off and retry a few times
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

export async function getDomains(): Promise<string[]> {
  const data = await api("/domains?page=1");
  const list = (data["hydra:member"] || []).filter((d: any) => d.isActive && !d.isPrivate);
  return list.map((d: any) => d.domain);
}

export async function createAccount(): Promise<MailAccount> {
  const domains = await getDomains();
  if (!domains.length) throw new Error("no-domains");
  const domain = domains[0];
  const password = randomString(14);

  // retry with a fresh address if one happens to collide
  let lastErr: unknown;
  for (let i = 0; i < 3; i++) {
    const address = `${randomString(10)}@${domain}`;
    try {
      await api("/accounts", { method: "POST", body: JSON.stringify({ address, password }) });
      const tokenRes = await api("/token", {
        method: "POST",
        body: JSON.stringify({ address, password }),
      });
      return { id: tokenRes.id, address, password, token: tokenRes.token };
    } catch (e) {
      lastErr = e;
      await sleep(600);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("create-failed");
}

export async function listMessages(token: string): Promise<MessageSummary[]> {
  const data = await api("/messages?page=1", {}, token);
  return data["hydra:member"] || [];
}

export async function getMessage(token: string, id: string): Promise<MessageDetail> {
  return api(`/messages/${id}`, {}, token);
}

export async function deleteMessage(token: string, id: string): Promise<void> {
  await api(`/messages/${id}`, { method: "DELETE" }, token);
}

export async function deleteAccount(token: string, id: string): Promise<void> {
  await api(`/accounts/${id}`, { method: "DELETE" }, token);
}
