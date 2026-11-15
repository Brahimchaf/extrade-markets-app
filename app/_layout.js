import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { I18nManager } from "react-native";
import { theme } from "../src/theme";
import { t, isRTL } from "../src/i18n";

if (isRTL && !I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: theme.bg },
          headerTitleStyle: { color: theme.text },
          headerTintColor: theme.gold,
          sceneStyle: { backgroundColor: theme.bg },
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
          },
          tabBarActiveTintColor: theme.gold,
          tabBarInactiveTintColor: theme.subtext,
        }}
      >
        <Tabs.Screen name="index" options={{ title: t("markets") }} />
        <Tabs.Screen name="news" options={{ title: t("news") }} />
        <Tabs.Screen name="analysis" options={{ title: t("analysis") }} />
      </Tabs>
    </>
  );
}
