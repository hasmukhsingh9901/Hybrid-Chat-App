import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplashScreen();
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "black",
          headerTitle: "",
          headerShown: false,
        }}
      />
      <StatusBar barStyle="dark-content" />
    </>
  );
}
