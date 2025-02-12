import { Link } from "expo-router";
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import logo from "../assets/images/sportify-logo.png";

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
              fontSize: 50, 
              width:180,
              lineHeight: 60, 
            }}
            className="text-white text-center"
          >
            SPORTIFY
          </Text>
        </View>

        <View className="mt-8" style={styles.buttonContainer}>
          <Link className="mb-1" href="/Explore">
            <Text style={styles.exploreButton} className="text-white">
              EXPLORE
            </Text>
          </Link>
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
    fontFamily: '',
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    // fontWeight: 'bold',
  },
})
