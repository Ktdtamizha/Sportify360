import { SplashScreen, Stack } from "expo-router";
import "./global.css"
import {useFonts} from 'expo-font'
import { useEffect } from "react";

export default function RootLayout() {

  const [fontsloaded] = useFonts({
    "SpaceMono":require('./assets/fonts/SpaceMono-Regular.ttf'),
    "Bangers":require('./assets/fonts/Bangers-Regular.ttf'),
    "PermanentMarker":require('./assets/fonts/PermanentMarker-Regular.ttf')

  })

  useEffect( () => {
    if(fontsloaded){
      SplashScreen.hideAsync();
    }
  },[fontsloaded]);

  if(!fontsloaded) return null;

  return (
  <Stack screenOptions={{headerShown:false}}>
    
    <Stack.Screen name="(root)/index"/>
    <Stack.Screen name="(tabs)"/>    
    </Stack>
)}
