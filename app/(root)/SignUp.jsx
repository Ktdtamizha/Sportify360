import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function SignUp() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}$/;
  const passwordLength = password.length >= 3 && password.length <= 10;

  const handleSubmit = () => {
    if (!username || !email || !password) {
      Alert.alert("Please fill in all fields!");
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert("Invalid email!", "Please enter a valid email id.");
      return;
    }

    if (!passwordLength) {
      Alert.alert(
        "Invalid password!",
        "Password must be between 3 and 10 characters."
      );
      return;
    }
    Alert.alert("Sign-Up Successful!");
    router.push("/Organize");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIGN UP</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        placeholderTextColor="rgba(255, 255, 255, 0.7)"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        placeholderTextColor="rgba(255, 255, 255, 0.7)"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        placeholderTextColor="rgba(255, 255, 255, 0.7)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/SignIn")}>
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text style={styles.signInText}>Sign In</Text>
        </Text>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: 2,
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
  signInText: {
    color: "white",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
