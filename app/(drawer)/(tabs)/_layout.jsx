import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import LiveT from './LiveT';
import PastT from './PastT';
import Up from './Upcoming';
import Hub from './Hub';
import Add from './Add';


export default function TabLayout() {

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
        />
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
          name="Hub"
          component={Hub}
          options={{
            title: 'HUB',
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                 <Ionicons name={focused ?'globe-outline' : 'globe'} size={26} color={focused ? 'black' : '#999'} />
                {focused && <Text style={styles.focusedText}>HUB</Text>}
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
