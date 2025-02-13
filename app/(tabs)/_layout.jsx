import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{headerShown:false}}>
      <Tabs.Screen name="LiveT" options={{ title: 'LIVE',
        tabBarIcon:({focused}) => (
            <Ionicons name={focused ? 'eye-outline' : 'eye-sharp'} color={focused ? "#5fb2ff" :  "#99908e"} size={28}/>
        )
      }} />
      <Tabs.Screen name="PastT" options={{ title: 'PAST',
        tabBarIcon:({focused}) => (
            <Ionicons name={focused ? 'checkmark-done-circle-outline' : 'checkmark-done-circle-sharp'} color={focused ? "#5fb2ff" :  "#99908e"} size={28}/>
        )
      }} />      
      <Tabs.Screen name="Upcoming" options={{ title: 'UPCOMING',
        tabBarIcon:({focused}) => (
            <Ionicons name={focused ? 'hourglass-outline' : 'hourglass-sharp'} color={focused ? "#5fb2ff" :  "#99908e"} size={28}/>
        )
      }} />    
      </Tabs>
  );
}
