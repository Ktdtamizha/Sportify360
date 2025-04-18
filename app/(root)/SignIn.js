import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet, StatusBar, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../utils/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSpring,
} from "react-native-reanimated";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const titleOpacity = useSharedValue(0);
  const inputOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 1000, easing: Easing.ease });
    inputOpacity.value = withTiming(1, { duration: 1000, easing: Easing.ease });
  }, []);

  const animateButton = () => {
    buttonScale.value = withSpring(0.9, { damping: 2, stiffness: 100 }, () => {
      buttonScale.value = withSpring(1);
    });
  };


  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
  
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
  
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
  
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo Push Token:", token);
    } else {
      alert("Must use physical device for Push Notifications");
    }
  
    return token;
  };
  

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
  
        const pushToken = await registerForPushNotificationsAsync();
  
        if (pushToken && userData.expoPushToken !== pushToken) {
          await updateDoc(userRef, {
            expoPushToken: pushToken,
          });
          console.log("Expo Push Token updated:", pushToken);
        }
      }
  
      router.push("/LiveT");
    } catch (error) {
      setErrorMessage(error.message);
    }
    finally {
      setLoading(false);
    }

  };
  

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const inputStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar backgroundColor="#16b8c9" />

          <Animated.Text style={[styles.title, titleStyle]}>LOGIN</Animated.Text>

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <Animated.View style={[styles.inputContainer, inputStyle]}>
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </Animated.View>

          <Animated.View style={[styles.buttonContainer, buttonStyle]}>
            <TouchableOpacity
              onPress={() => {
                animateButton();
                handleSubmit();
              }}
              style={styles.button}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (

              <Text style={styles.buttonText}>SUBMIT</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity onPress={() => router.replace("/SignUp")}>
            <Text style={styles.footerText}>
              Don't have an account? <Text style={styles.signUpText}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  inputContainer: {
    width: "100%",
    alignItems: "center",
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
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "black",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 15,
    width: "60%",
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
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});