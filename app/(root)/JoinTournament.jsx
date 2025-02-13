import { FlatList, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import matches from '../matches'
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity } from 'react-native'
const JoinTournament = () => {

  const upmatch = matches.filter((match)=>match.type == 'Up');
  
  return (
    <LinearGradient colors={['#f0fbef','#c0efbb']} style={{flex:1}}>
      <ScrollView style={{marginTop:100}}>
      <FlatList
      data={upmatch}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(match) => match.id}
      renderItem={({item}) =>
          <ImageBackground source={item.image} style={styles.card} imageStyle={styles.image}>
          <View style={styles.overlay}>
            <Text style={styles.text}>{item.name}</Text>
          </View>

          <TouchableOpacity style={styles.overlay2}>
            <Text style={styles.text}>JOIN</Text>
          </TouchableOpacity>
        </ImageBackground>
      }/>
      </ScrollView>
      </LinearGradient>
  )
}

export default JoinTournament;

const styles = StyleSheet.create({
  card: {
    marginLeft:13,
    width:350, 
    height: 650,
    borderRadius: 16,
    overflow:"hidden",
    marginHorizontal: 40,
  },
  image: {
    borderRadius: 16,
  },
  overlay: {
    position:"fixed",
    bottom: 0,
    width: "100%",
    height: 50,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay2: {
    position:"absolute",
    bottom: 0,
    width: "100%",
    height: 50,
    backgroundColor: "rgb(21, 162, 97)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

