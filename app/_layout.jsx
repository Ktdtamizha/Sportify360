import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen"; 
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import "./global.css";
import { Image, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

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
    <>
    <StatusBar hidden={true}/>
    <Stack screenOptions={{ headerShown: false }}/>
    </>
  );
}

