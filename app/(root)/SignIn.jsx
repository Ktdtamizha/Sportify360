import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

export default function SignIn() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!username || !password) {
      Alert.alert("Please fill in all fields!");
      return;
    }
    Alert.alert("Login Successful!");
    router.push("/Organize");
  };

  return (
    <View style={styles.outerBorder}>
      <StatusBar backgroundColor="#16b8c9" />
      <View style={styles.container}>
        <Text style={styles.title}>LOGIN</Text>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>SUBMIT</Text>
        </TouchableOpacity>

        {/* Sign-Up Navigation */}
        <TouchableOpacity onPress={() => router.replace("/SignUp")}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text style={styles.signUpText}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerBorder: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: 2,
    textShadowColor: "rgba(255,255,255,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 30,
  },
  input: {
    width: "85%",
    color: "white",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "black",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 15,
    width: "60%",
    marginTop: 40,
    alignItems: "center",
    shadowColor: "white",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  footerText: {
    marginTop: 20,
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  signUpText: {
    color: "white",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
