import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View, StyleSheet, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import LiveT from './LiveT';
import PastT from './PastT';
import Up from './Upcoming';
import Scorer from './Hub';
import Add from './Add';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../utils/firebase.js';

export default function TabLayout() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserLoggedIn(true);
      } else {
        setUserLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
    <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tab.Screen
          name="LiveT"
          component={LiveT}
          options={{
            title: 'LIVE',
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                <Ionicons name={focused ? 'eye-outline' : 'eye-sharp'} size={28} color={focused ? 'black' : '#999'}/>
                {focused && <Text style={styles.focusedText}>LIVE</Text>}
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="PastT"
          component={PastT}
          options={{
            title: 'PAST',
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                <Ionicons name={focused ? 'refresh-circle-outline' : 'refresh-circle'} size={28} color={focused ? 'black' : '#999'} />
                {focused && <Text style={styles.focusedText}>PAST</Text>}
              </View>
            ),
          }}
        />
        {userLoggedIn ?
        <Tab.Screen
          name="Add"
          component={Add}
          options={{
            title: 'ADD',
            tabBarIcon: ({focused}) => (
              <View style={styles.addButton}>
                 <Ionicons name={focused ? 'add' : 'add-outline'} size={28} color={'white'} />
              </View>
            ),
          }}
        /> : null}
        <Tab.Screen
          name="Upcoming"
          component={Up}
          options={{
            title: 'UPCOMING',
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                 <Ionicons name={focused ? 'play-forward-circle' : 'play-forward-circle-outline'} size={28} color={focused ? 'black' : '#999'} />
                {focused && <Text style={styles.focusedTextSmall}>UP</Text>}
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Find"
          component={Scorer}
          options={{
            title: 'Find',
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                 <Ionicons name={focused ? 'search' : 'search-outline'} size={26} color={focused ? 'black' : '#999'} />
                {focused && <Text style={styles.focusedText}>Find</Text>}
              </View>
            ),
          }}
        />
      </Tab.Navigator>      
      </>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 3,
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 50, 
  },
  headerRight: {
    marginRight: 5,
  },
  tabBarStyle: {
    backgroundColor: 'white',
    borderTopWidth: 0,
    paddingBottom: 10,
    
  },
  iconContainer: {
    alignItems: 'center',
  },
  focusedText: {
    fontSize: 10,
    color: 'black',
    paddingLeft: 4,
  },
  focusedTextSmall: {
    fontSize: 9,
    color: 'black',
  },
  addButton: {
    height: 60,
    width: 60,
    backgroundColor: '#407503',
    borderRadius: 50, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
});
