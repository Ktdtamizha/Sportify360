import { Link } from "expo-router";
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import logo from "../assets/images/sportify-logo.png";
import { LinearGradient } from "expo-linear-gradient";


export default function Index() {

  StatusBar.setHidden(true);
  const img = require('../assets/images/tennis-ball.png');

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
          fontFamily: "RubikGlitch",
          fontSize: 50,
          width: 300,
          lineHeight: 80,
          textAlign: "center",
          color: "#8bc34a",
          textShadowRadius: 50,
          marginLeft:20,
        }}
      >
        <Text style={{fontSize:70}} className="text-white">S</Text>P<Image style={{width:38,height:34}} source={img}></Image>RTIFY
      </Text>
      
        </View>

        <View className="mt-8 flex items-center">
      <LinearGradient
        colors={["#000000", "#4F4F4F"]}
        start={[0,0]}
        end={[1, 0]}
        style={{
          borderRadius:30,
        }}
      >
        <Link href="/Explore" asChild>
          <TouchableOpacity activeOpacity={0.8} className="px-6 py-3">
            <Text
              className="tracking-widest"
              style={{
                fontFamily:'RubikGlitch',
                fontSize:25,
                color:"#8bc34a"
              }}
            >
              <Text className="text-white">E</Text>XPLOR<Text className="text-white">E</Text>
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
