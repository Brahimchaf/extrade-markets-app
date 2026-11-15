import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../src/theme";
import { t } from "../src/i18n";
import { fetchNews } from "../src/api";

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(false);
      setItems(await fetchNews());
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
        data={items}
        keyExtractor={(i, idx) => i.link || String(idx)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} tintColor={theme.gold} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            {error ? t("errorLoad") : loading ? t("loading") : t("noNews")}
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => item.link && Linking.openURL(item.link)}
          >
            <Text style={styles.title}>{item.title}</Text>
            {!!item.desc && <Text style={styles.desc}>{item.desc}</Text>}
            <Text style={styles.more}>{t("readMore")} ›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  list: { padding: 16 },
  card: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  title: { color: theme.text, fontSize: 16, fontWeight: "600", lineHeight: 22 },
  desc: { color: theme.subtext, fontSize: 13, marginTop: 6, lineHeight: 18 },
  more: { color: theme.gold, fontSize: 13, marginTop: 10 },
  empty: { color: theme.subtext, textAlign: "center", marginTop: 40 },
});
