import {  StyleSheet, TouchableOpacity } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import TabLayout from './(tabs)/_layout.jsx'
import { Ionicons } from '@expo/vector-icons';
import CustomDrawer from '../../components/CustomDrawer.jsx';
import SignIn from '../(root)/SignIn.jsx';
import SignUp from '../(root)/SignUp.jsx';

const Drawer = createDrawerNavigator();

const DrawerLayout = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props}/>} screenOptions={{headerShown:false,headerLeftContainerStyle:{marginBottom:20},headerRightContainerStyle:{marginBottom:20},headerTitleContainerStyle:{marginBottom:20}}}>
        <Drawer.Screen
        name="Home"
        component={TabLayout}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle:'',
          headerTitleAlign:'center',
          headerTitleStyle: {
            fontFamily:'RubikGlitch',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333', 
            letterSpacing: 2,
           
          },
          headerTintColor:'black',
          headerRight: () => (
            <TouchableOpacity onPress={() => {}} style={styles.headerRight}>
              <Ionicons name="notifications-outline" size={28} color="black"/>
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen name='Login'
      component={SignIn}/>
      <Drawer.Screen name='SignUp'
      component={SignUp}/>
      </Drawer.Navigator>
  )
}

export default DrawerLayout

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
      backgroundColor: '#C0E990',
      borderTopWidth: 0,
      paddingBottom: 10,
    },
    iconContainer: {
      alignItems: 'center',
    }
  });