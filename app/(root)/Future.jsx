import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Processing() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require("../assets/images/future.jpg")} style={styles.image} />
        <Text style={styles.text}>Will be Updated Soon...</Text>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.subtext}></Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/Explore")}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#1c1c1c",
    width: 300,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
    elevation: 5,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginTop: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#16b8c9",
    padding: 15,
    borderRadius: 10,
    width: 180,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
