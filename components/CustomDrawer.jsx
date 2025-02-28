import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../app/firebase.jsx"; 
import { onAuthStateChanged, signOut } from "firebase/auth"; 
import { doc, getDoc } from "firebase/firestore";
import { router } from "expo-router";

const CustomDrawer = (props) => {
  const [username, setUsername] = useState("Loading...");
  const [profilePic, setProfilePic] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserLoggedIn(true);
        const userDoc = await getDoc(doc(db,"users",user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || "User");
          setProfilePic(userDoc.data().profilePic || null);
        }
      } else {
        setUserLoggedIn(false);
        setUsername("Guest");
        setProfilePic(null);
      }
    });

    return () => unsubscribe();
  }, []);

 
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged Out Successfully");
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Logout Failed");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <LinearGradient colors={["#fff", "#fff"]} style={styles.profileContainer}>
          <Image
            source={profilePic ? { uri: profilePic } : require("../assets/images/volley.png")}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{username}</Text>
          <Text style={styles.welcomeText}>
            {userLoggedIn ? `${username}` : "Guest"}
          </Text>
        </LinearGradient>

        <View style={styles.drawerItems}>
          <DrawerItemList {...props} />
          
          {!userLoggedIn && (
            <>
              <TouchableOpacity onPress={() => router.push('/SignIn')} style={styles.authButton}>
                <Text style={styles.authButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/SignUp')} style={styles.authButton}>
                <Text style={styles.authButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </DrawerContentScrollView>

      {userLoggedIn && (
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  drawerContent: {
    paddingBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 15,
  },
  profileImage: {
    height: 90,
    width: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "white",
  },
  profileName: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  welcomeText: {
    color: "black",
    fontSize: 20,
    marginTop: 5,
    letterSpacing:2,
    paddingRight:8,
    fontWeight:'600',
  },
  drawerItems: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 18,
    justifyContent: "center",
    marginBottom: 30,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  authButton: {
    marginTop:40,
    backgroundColor: "green",
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: "center",
    marginVertical: 5,
  },
  authButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
