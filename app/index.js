import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../src/theme";
import { t } from "../src/i18n";
import { fetchPrices } from "../src/api";

export default function Markets() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updated, setUpdated] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(false);
      const data = await fetchPrices();
      setPrices(data);
      setUpdated(new Date());
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <FlatList
        data={prices}
        keyExtractor={(i) => i.symbol}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} tintColor={theme.gold} />
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.tagline}>{t("tagline")}</Text>
            {updated && (
              <Text style={styles.updated}>
                {t("updated")}: {updated.toLocaleTimeString()}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>{error ? t("errorLoad") : t("loading")}</Text>
        }
        renderItem={({ item }) => <PriceRow item={item} />}
        ListFooterComponent={
          <Text style={styles.disclaimer}>{t("disclaimerShort")}</Text>
        }
      />
    </SafeAreaView>
  );
}

function PriceRow({ item }) {
  const up = item.change != null && item.change >= 0;
  const color = item.change == null ? theme.subtext : up ? theme.green : theme.red;
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.symbol}>{item.symbol}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.price}>{item.price.toFixed(item.dp)}</Text>
        <Text style={[styles.change, { color }]}>
          {item.change == null ? "—" : (up ? "▲ " : "▼ ") + item.change.toFixed(2) + "%"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  list: { padding: 16 },
  tagline: { color: theme.subtext, fontSize: 14, marginBottom: 4 },
  updated: { color: theme.subtext, fontSize: 12, marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  symbol: { color: theme.text, fontSize: 17, fontWeight: "600" },
  name: { color: theme.subtext, fontSize: 13, marginTop: 2 },
  price: { color: theme.text, fontSize: 17, fontWeight: "600" },
  change: { fontSize: 13, marginTop: 2, fontWeight: "500" },
  empty: { color: theme.subtext, textAlign: "center", marginTop: 40 },
  disclaimer: { color: theme.subtext, fontSize: 11, textAlign: "center", marginTop: 16 },
});
