import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../src/theme";
import { t } from "../src/i18n";
import { fetchPrices, buildAnalysis } from "../src/api";

export default function Analysis() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(false);
      const prices = await fetchPrices();
      setCards(buildAnalysis(prices));
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const biasLabel = (b) => t(b);
  const biasColor = (b) =>
    b === "bullish" ? theme.green : b === "bearish" ? theme.red : theme.subtext;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} tintColor={theme.gold} />
        }
      >
        <Text style={styles.h1}>{t("todayAnalysis")}</Text>
        {cards.length === 0 && (
          <Text style={styles.empty}>
            {error ? t("errorLoad") : t("loading")}
          </Text>
        )}
        {cards.map((c) => (
          <View key={c.symbol} style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.symbol}>{c.name}</Text>
              <Text style={[styles.badge, { color: biasColor(c.bias) }]}>
                {t("bias")}: {biasLabel(c.bias)}
              </Text>
            </View>
            <Text style={styles.note}>{c.note}</Text>
            {c.change != null && (
              <Text style={[styles.change, { color: biasColor(c.bias) }]}>
                {t("change24")}: {c.change.toFixed(2)}%
              </Text>
            )}
          </View>
        ))}

        <View style={styles.riskBox}>
          <Text style={styles.riskTitle}>{t("riskTitle")}</Text>
          <Text style={styles.riskText}>{t("risk")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  list: { padding: 16 },
  h1: { color: theme.text, fontSize: 20, fontWeight: "700", marginBottom: 12 },
  card: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  symbol: { color: theme.text, fontSize: 17, fontWeight: "600" },
  badge: { fontSize: 13, fontWeight: "600" },
  note: { color: theme.subtext, fontSize: 14, lineHeight: 20 },
  change: { fontSize: 13, marginTop: 8, fontWeight: "500" },
  empty: { color: theme.subtext, textAlign: "center", marginTop: 40 },
  riskBox: {
    backgroundColor: theme.card,
    borderColor: theme.warn,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  riskTitle: { color: theme.gold, fontSize: 14, fontWeight: "700", marginBottom: 6 },
  riskText: { color: theme.subtext, fontSize: 13, lineHeight: 19 },
});
