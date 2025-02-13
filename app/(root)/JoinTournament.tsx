import { FlatList, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import matches from '../matches'
import { LinearGradient } from 'expo-linear-gradient'
const JoinTournament = () => {

  const upmatch = matches.filter((match)=>match.type == 'Up');
  
  return (
    <LinearGradient colors={['#7ff5a1','#c8e6d2']} style={{flex:1}}>
      <ScrollView>
        <View>
        <Text style={{fontFamily:'Bangers',fontSize:60,color:'black', margin:20}} className='text-center'>JOIN TOURNAMENTS</Text>
        </View>
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
        </ImageBackground>
      }/>
      </ScrollView>
      </LinearGradient>
  )
}

export default JoinTournament;

const styles = StyleSheet.create({
  card: {
    marginTop:50,
    width:300, 
    height: 400,
    borderRadius: 16,
    overflow:"hidden",
    marginHorizontal: 12,
  },
  image: {
    borderRadius: 16,
  },
  overlay: {
    position:"absolute",
    bottom: 0,
    width: "100%",
    height: 50,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

