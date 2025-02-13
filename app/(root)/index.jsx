import { Link } from "expo-router";
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import logo from "../assets/images/sportify-logo.png";
import { LinearGradient } from "expo-linear-gradient";


export default function Index() {

  StatusBar.setHidden(true);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 justify-center items-center bg-black">
        <View className="relative items-center mb-6">
          <Image
            source={logo}
            style={{ width: 300, height: 300 }} 
            resizeMode="contain"
          />
    <Text
        style={{
          fontFamily: "Bangers",
          fontSize: 70,
          width: 300,
          lineHeight: 80,
          textAlign: "center",
          color: "#FFF",
          textShadowColor: "rgba(255, 255, 255, 0.8)",
          textShadowOffset: { width: 3, height: 2 },
          textShadowRadius: 50,
        }}
      >
        SPORTIFY
      </Text>
      
        </View>

        <View className="mt-8 flex items-center">
      <LinearGradient
        colors={["#000000", "#4F4F4F"]}
        start={[0, 0]}
        end={[1, 1]}
        style={{
          borderRadius:30,
        }}
      >
        <Link href="/Explore" asChild>
          <TouchableOpacity activeOpacity={0.8} className="px-6 py-3">
            <Text
              className="text-white font-bold tracking-widest"
              style={{
                textShadowColor: "rgba(255, 255, 255, 0.6)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 3,
                fontSize:25,
              }}
            >
              EXPLORE
            </Text>
          </TouchableOpacity>
        </Link>
      </LinearGradient>
    </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 30,
    paddingVertical: 22,
    borderWidth: 2,
    borderColor: '#A4DE02',
    borderRadius: 30,
  },
  exploreButton: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
  },
})
