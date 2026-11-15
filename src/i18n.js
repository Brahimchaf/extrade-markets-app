import * as Localization from "expo-localization";

const strings = {
  en: {
    markets: "Markets",
    news: "News",
    analysis: "Analysis",
    gold: "Gold",
    forex: "Forex",
    tagline: "Gold & forex prices, market news and daily analysis",
    pullToRefresh: "Pull down to refresh",
    updated: "Updated",
    loading: "Loading…",
    errorLoad: "Could not load data. Pull down to try again.",
    riskTitle: "Risk warning",
    risk:
      "Trading involves a high risk of loss and may not be suitable for everyone. This app provides market news and educational information only and is not financial advice.",
    bias: "Bias",
    bullish: "Bullish",
    bearish: "Bearish",
    neutral: "Neutral",
    change24: "Change",
    todayAnalysis: "Today's market read",
    readMore: "Read more",
    noNews: "No news available right now.",
    disclaimerShort: "Indicative prices, may be delayed. Not financial advice.",
  },
  ar: {
    markets: "الأسواق",
    news: "الأخبار",
    analysis: "التحليل",
    gold: "الذهب",
    forex: "العملات",
    tagline: "أسعار الذهب والعملات وأخبار السوق والتحليل اليومي",
    pullToRefresh: "اسحب للأسفل للتحديث",
    updated: "تم التحديث",
    loading: "جارٍ التحميل…",
    errorLoad: "تعذّر تحميل البيانات. اسحب للأسفل للمحاولة مرة أخرى.",
    riskTitle: "تحذير المخاطر",
    risk:
      "ينطوي التداول على مخاطر عالية للخسارة وقد لا يكون مناسبًا للجميع. يقدّم هذا التطبيق أخبار السوق ومعلومات تعليمية فقط وليس نصيحة مالية.",
    bias: "الاتجاه",
    bullish: "صاعد",
    bearish: "هابط",
    neutral: "محايد",
    change24: "التغير",
    todayAnalysis: "قراءة السوق اليوم",
    readMore: "اقرأ المزيد",
    noNews: "لا توجد أخبار متاحة حاليًا.",
    disclaimerShort: "أسعار استرشادية وقد تتأخر. ليست نصيحة مالية.",
  },
};

const code = (Localization.getLocales?.()[0]?.languageCode || "en").toLowerCase();
export const lang = code === "ar" ? "ar" : "en";
export const isRTL = lang === "ar";
export const t = (key) => strings[lang][key] || strings.en[key] || key;
