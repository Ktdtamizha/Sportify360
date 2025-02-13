import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import matches from '../matches';
import { LinearGradient } from 'expo-linear-gradient';
const PastT = () => {
  const pastmatches = matches.filter((match) => match.type == 'Past');

  return (
      <View style={{flex:1}}>
      <LinearGradient colors={['#7ff5a1','#c8e6d2']}
 style={{flex:1,paddingVertical:20}}>
      <Text style={{fontFamily:'Bangers',fontSize:60,color:'#0a8efa'}} className='text-center'>PAST TOURNAMENTS</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
            {pastmatches.map((match) => (
              <View key={match.id} style={styles.matchCard}>
                <Text style={styles.matchText}>{match.name}</Text>
              </View>
            ))}
        </ScrollView>
      </LinearGradient>
    </View>
  )
}

export default PastT

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  matchCard: {
    width: '80%',
    height: 100,
    backgroundColor: '#fafffc',
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