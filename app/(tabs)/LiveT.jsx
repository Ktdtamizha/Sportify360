import { FlatList, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import matches from '../matches.js'
import {LinearGradient} from 'expo-linear-gradient';

const LiveT = () => {

  const livematches = matches.filter((match) => match.type == 'Live');

  return (
<LinearGradient colors={['#f0fbef','#c0efbb']} style={{flex:1}}>
      <FlatList
      data={livematches}
      keyExtractor={(match) => match.id}
      contentContainerStyle={{flexGrow:1}}
      renderItem={({item}) =>
        <TouchableOpacity>
        <ImageBackground source={item.image} style={styles.card} imageStyle={styles.image}>
          <View style={styles.overlay}>
            <Text style={styles.text}>{item.name}</Text>
          </View>
        </ImageBackground>
        </TouchableOpacity>
      }
      style={{marginBottom:30,
        marginTop:40
      }}/>
  </LinearGradient>
 
  )
}

export default LiveT

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