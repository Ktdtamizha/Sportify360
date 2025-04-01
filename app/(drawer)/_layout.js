import { StyleSheet, TouchableOpacity, View, Image, StatusBar } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabLayout from './(tabs)/_layout.js';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawer from '../../components/CustomDrawer.js';
import { Text } from 'react-native';
import TournamentDetails from '../(root)/OrgDashboard.js';

const Drawer = createDrawerNavigator();

const DrawerLayout = () => {
  return (
    <>
    <StatusBar hidden={false}/>
      <Drawer.Navigator 
        drawerContent={(props) => <CustomDrawer {...props}/>} 
        screenOptions={{
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: 'left',
          headerStyle: { backgroundColor: 'rgba(0, 128, 0, 0.7)' },
          headerTitle: () => (    
          <View style={styles.headerTitleContainer}>
            <Image source={require('../assets/images/pnglogo.png')} style={styles.logo} />
            <Text style={styles.headerTitle}>PORTIFY</Text>
          </View>),
          headerTintColor: 'white',
          headerRight: () => (
            <TouchableOpacity onPress={() => {}} style={styles.headerRight}>
              <Ionicons name="notifications-outline" size={28} color="white"/>
            </TouchableOpacity>
          ),
        }}
      >
        <Drawer.Screen name="Home" component={TabLayout} />
        <Drawer.Screen name="Admin" component={TournamentDetails} />
      </Drawer.Navigator>
    </>
  );
};

export default DrawerLayout;

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom:0,
    },
  logo: {
    width: 20,
    height: 30,
    marginBottom:2,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily:'RubikGlitch',
    color: 'white',
    letterSpacing: 2,
  },
  headerRight: {
    marginRight: 10,
  },
  tabBarStyle: {
    backgroundColor: '#C0E990',
    borderTopWidth: 0,
    paddingBottom:0,
  },
  iconContainer: {
    alignItems:"center",
  }
});