import { Link, router } from "expo-router";
import React from "react";
import { View, ImageBackground, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import img1 from '../assets/images/cricket.webp';
import img2 from '../assets/images/hock.webp';
import img3 from '../assets/images/football2.webp';


export default function Explore() {

  const bgImage = require("../assets/images/bg-logo.jpg");

  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
       <View style={styles.overlay} />
      <SafeAreaView className="flex-1 justify-center items-center">
      <Text
        style={{
          fontSize: 40,
          fontFamily:'SpaceMono',
          color: "#A8E6A2",
          textAlign: "center",
          textShadowColor: "rgba(0, 0, 0, 0.4)", 
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 5,
          letterSpacing: 0, 
        }}
      >ENTER
        <Text className="text-white"> ARENA</Text>
      </Text>     
      <View className="w-full flex-1 justify-evenly items-center">
        <Link href="/Display">
          <ImageBackground
            source={img1}
            resizeMode="contain"
            className="w-80 h-52 rounded-xl overflow-hidden"
            imageStyle={{ borderRadius: 15 }}
          />
        </Link>

        <TouchableOpacity onPress={() => router.push('/Future')}>
          <ImageBackground
            source={img2}
            resizeMode="contain"
            className="w-80 h-48 rounded-xl overflow-hidden"
            imageStyle={{ borderRadius: 15 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/Future')}>
          <ImageBackground
            source={img3}
            resizeMode="contain"
            className="w-80 h-52 rounded-xl overflow-hidden"
            imageStyle={{ borderRadius: 15 }}
          />
        </TouchableOpacity>

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
    backgroundColor: "rgba(0, 0, 0, 0.85)", 
  },
})
