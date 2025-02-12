import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import matches from '../matches.js'
import {LinearGradient} from 'expo-linear-gradient';

const LiveT = () => {

  const livematches = matches.filter((match) => match.type == 'Live');

  return (
      <View style={{flex:1}}>
      <LinearGradient colors={['#f0edeb','#e8bda0','#f27f33']} style={{flex:1,paddingVertical:20}}>
      <Text style={{fontFamily:'Bangers',fontSize:60,color:'#0a8efa'}} className='text-center'>LIVE TOURNAMENTS</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
            {livematches.map((match) => (
              <View key={match.id} style={styles.matchCard}>
                <Text style={styles.matchText}>{match.name}</Text>
              </View>
            ))}
        </ScrollView>
      </LinearGradient>
    </View>
 
  )
}

export default LiveT

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 20,
    alignItems: 'center',
    flexGrow:1,
    paddingBottom:80,
  },
  gradient: {
    flex: 1,
    paddingVertical: 20,
  },
  matchCard: {
    width: '80%',
    height: 100,
    backgroundColor: '#f7eddf',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  matchText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});