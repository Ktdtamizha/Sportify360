import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import matches from '../matches';
import { LinearGradient } from 'expo-linear-gradient';


const Upcoming = () => {
  const upmatches = matches.filter((match) => match.type == 'Up');

  return (
      <View style={{flex:1}}>
      <LinearGradient colors={['#e5fae3', '#abffa3', '#34eb3a']}
 style={{flex:1,paddingVertical:20}}>
      <Text style={{fontFamily:'Bangers',fontSize:60,color:'#0a8efa'}} className='text-center'>UPCOMING TOURNAMENTS</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
            {upmatches.map((match) => (
              <View key={match.id} style={styles.matchCard}>
                <Text style={styles.matchText}>{match.name}</Text>
              </View>
            ))}
        </ScrollView>
      </LinearGradient>
    </View>
  )
}

export default Upcoming

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  matchCard: {
    width: '80%',
    height: 100,
    backgroundColor: '#dcf5dd',
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