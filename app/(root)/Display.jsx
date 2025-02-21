import { LinearGradient } from 'expo-linear-gradient';
import {  useRouter } from 'expo-router';
import React from 'react';
import {MotiView} from 'moti';
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity } from 'react-native';

export default function Profile() {

const router = useRouter();
const display = [
  {id:"1",type : "VIEW TOURNAMENT",image : require('../assets/images/view3.jpg'),link:'LiveT'},
  {id:"2",type : "JOIN TOURNAMENT",image : require('../assets/images/join1.jpg'),link:'JoinTournament'},
  {id:"3",type : "ADD TOURNAMENT",image : require('../assets/images/add1.jpg'),link:'SignUp'},
  {id:"4",type : "MATCH HUB",image : require('../assets/images/view2.jpg'),link:'Future'},
]

  return (
 <LinearGradient colors={['#f0fbef','#c0efbb']} style={{flex:1}}>
      <FlatList
      data={display}
      keyExtractor={(match) => match.id}
      contentContainerStyle={{flexGrow:1}}
      renderItem={({item}) =>
        <TouchableOpacity onPress={() => router.push(`/${item.link}`)}>
            <MotiView
    from={{ opacity: 0, translateY: 20 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: "spring", damping: 20 }}
  >
        <ImageBackground source={item.image} style={styles.card} imageStyle={styles.image}>
          <View style={styles.overlay}>
            <Text style={styles.text}>{item.type}</Text>
          </View>
        </ImageBackground>
        </MotiView>
        </TouchableOpacity>
      }
      style={{marginBottom:30,
        marginTop:40
      }}/>
  </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  card: {
    marginTop:40,
    width:350, 
    height: 190,
    borderRadius: 16,
    overflow:"hidden",
    marginLeft:22
  },
  image: {
    borderRadius: 16,
  },
  overlay: {
    position:"absolute",
    bottom: 0,
    width: "100%",
    height: 50,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
