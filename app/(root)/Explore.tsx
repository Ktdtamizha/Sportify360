import { Link } from "expo-router";
import React from "react";
import { View, ImageBackground, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Explore() {

  const bgImage = require("../assets/images/bg-logo.jpg");

  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
       <View style={styles.overlay} />
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text style={{fontFamily:'SpaceMono'}} className="text-white pt-8 text-4xl text-center">CHOOSE YOUR SPORT</Text>
      <View className="w-full flex-1 justify-evenly items-center">

        <Link href="/Display">
          <ImageBackground
            source={require("../assets/images/cricket.png")}
            resizeMode="contain"
            className="w-80 h-52 rounded-xl overflow-hidden"
            imageStyle={{ borderRadius: 15 }}
          />
        </Link>

        <Link href="/Display">
          <ImageBackground
            source={require("../assets/images/hock.png")}
            resizeMode="contain"
            className="w-80 h-48 rounded-xl overflow-hidden"
            imageStyle={{ borderRadius: 15 }}
          />
        </Link>

        <Link href="/Display">
          <ImageBackground
            source={require("../assets/images/football2.png")}
            resizeMode="contain"
            className="w-80 h-52 rounded-xl overflow-hidden"
            imageStyle={{ borderRadius: 15 }}
          />
        </Link>

      </View>
    </SafeAreaView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position:"relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: "rgba(0, 0, 0, 0.8)", 
  },
})
