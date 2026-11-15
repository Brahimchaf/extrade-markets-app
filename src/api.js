// All sources below are free and require no API key.
// FX: frankfurter.app (ECB daily rates). Gold: gold-api.com. News: public RSS.

import AsyncStorage from "@react-native-async-storage/async-storage";

const FX_PAIRS = [
  { symbol: "EUR/USD", from: "EUR", to: "USD", dp: 4 },
  { symbol: "GBP/USD", from: "GBP", to: "USD", dp: 4 },
  { symbol: "USD/JPY", from: "USD", to: "JPY", dp: 2 },
  { symbol: "USD/CHF", from: "USD", to: "CHF", dp: 4 },
];

function prevBusinessDay() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const day = d.getDay();
  if (day === 0) d.setDate(d.getDate() - 2);
  if (day === 6) d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

export async function fetchPrices() {
  const out = [];

  // Gold (XAU/USD)
  try {
    const g = await fetchJSON("https://api.gold-api.com/price/XAU");
    const price = Number(g.price);
    const prevRaw = await AsyncStorage.getItem("gold_prev");
    const prev = prevRaw ? Number(prevRaw) : null;
    const change = prev ? ((price - prev) / prev) * 100 : null;
    await AsyncStorage.setItem("gold_prev", String(price));
    out.push({ symbol: "XAU/USD", name: "Gold", price, dp: 2, change });
  } catch (e) {
    // skip gold on failure
  }

  // FX pairs with 1-day change from ECB
  try {
    const latest = await fetchJSON("https://api.frankfurter.app/latest");
    let prev = {};
    try {
      prev = (await fetchJSON("https://api.frankfurter.app/" + prevBusinessDay())).rates || {};
    } catch (e) {}
    for (const p of FX_PAIRS) {
      const cur = computePair(latest.rates, p.from, p.to, latest.base, latest.amount);
      const old = computePair(prev, p.from, p.to, latest.base, latest.amount);
      if (cur == null) continue;
      const change = old ? ((cur - old) / old) * 100 : null;
      out.push({ symbol: p.symbol, name: p.symbol, price: cur, dp: p.dp, change });
    }
  } catch (e) {}

  if (out.length === 0) throw new Error("no price data");
  return out;
}

// frankfurter base is EUR; derive arbitrary pair from EUR-based rates.
function computePair(rates, from, to, base = "EUR") {
  if (!rates) return null;
  const r = { ...rates, [base]: 1 };
  if (r[from] == null || r[to] == null) return null;
  return r[to] / r[from];
}

const FEEDS = [
  "https://www.fxstreet.com/rss/news",
  "https://feeds.marketwatch.com/marketwatch/topstories/",
];

export async function fetchNews() {
  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed);
      if (!res.ok) continue;
      const xml = await res.text();
      const items = parseRSS(xml);
      if (items.length) return items.slice(0, 25);
    } catch (e) {}
  }
  throw new Error("no news");
}

function parseRSS(xml) {
  const items = [];
  const blocks = xml.split(/<item[ >]/i).slice(1);
  for (const b of blocks) {
    const title = pick(b, "title");
    const link = pick(b, "link");
    const date = pick(b, "pubDate");
    let desc = pick(b, "description").replace(/<[^>]+>/g, "").trim();
    if (desc.length > 180) desc = desc.slice(0, 180) + "…";
    if (title) items.push({ title: clean(title), link: clean(link), date, desc: clean(desc) });
  }
  return items;
}

function pick(block, tag) {
  const m =
    block.match(new RegExp("<" + tag + "[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></" + tag + ">", "i")) ||
    block.match(new RegExp("<" + tag + "[^>]*>([\\s\\S]*?)</" + tag + ">", "i"));
  return m ? m[1] : "";
}

function clean(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Daily analysis computed from the day's price moves — not a static message.
export function buildAnalysis(prices) {
  const gold = prices.find((p) => p.symbol === "XAU/USD");
  const eur = prices.find((p) => p.symbol === "EUR/USD");
  const cards = [];

  function biasOf(change) {
    if (change == null) return "neutral";
    if (change > 0.15) return "bullish";
    if (change < -0.15) return "bearish";
    return "neutral";
  }

  if (gold) {
    cards.push({
      symbol: "XAU/USD",
      name: "Gold",
      bias: biasOf(gold.change),
      change: gold.change,
      note:
        gold.change == null
          ? "Tracking gold against the US dollar. Watch for the daily change on your next refresh."
          : gold.change >= 0
          ? "Gold is firmer against the dollar today. Dollar strength and real yields remain the key drivers to watch."
          : "Gold is softer against the dollar today. A firmer dollar or rising yields can weigh on the metal.",
    });
  }
  if (eur) {
    cards.push({
      symbol: "EUR/USD",
      name: "EUR/USD",
      bias: biasOf(eur.change),
      change: eur.change,
      note:
        eur.change == null
          ? "The world's most traded pair. Dollar direction sets the tone."
          : eur.change >= 0
          ? "The euro is gaining on the dollar. Rate expectations on both sides drive the move."
          : "The dollar is firmer against the euro. Watch US data and rate expectations.",
    });
  }
  return cards;
}
