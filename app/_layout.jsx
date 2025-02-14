import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen"; 
import { useEffect } from "react";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
    Bangers: require("./assets/fonts/Bangers-Regular.ttf"),
    ShadowsIntoLight: require("./assets/fonts/ShadowsIntoLight-Regular.ttf"),
    RubikGlitch: require("./assets/fonts/RubikGlitch-Regular.ttf"),
  });

  useEffect(() => {
    async function hideSplash() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplash();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null; 
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(root)/index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
