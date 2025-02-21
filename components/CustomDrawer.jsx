import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const CustomDrawer = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <LinearGradient colors={['white', 'white']} style={styles.profileContainer}>
          <Image source={require('../assets/images/volley.png')} style={styles.profileImage} />
          <Text style={styles.profileName}>Kathir</Text>
        </LinearGradient>
        
        <View style={styles.drawerItems}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => alert('Logged Out')}>
          <Ionicons name="log-out-outline" size={22} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  drawerContent: {
    paddingBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
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
  borderColor: 'white',
  backgroundColor: 'rgba(95, 182, 74, 0.2)',
  shadowColor: '#5FB64A', 
  shadowOpacity: 0.7,
  shadowRadius: 10,
  elevation: 8,
},

  profileName: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  drawerItems: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 18,
    justifyContent: 'center',
    marginBottom:30
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
