import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, FlatList, TouchableOpacity } from 'react-native';

const bgImage = require('../assets/images/stadium.jpg'); 

export default function Profile() {

  const router = useRouter();
const display = [
  {id:"1",type : "VIEW TOURNAMENT",image : require('../assets/images/bg-logo.jpg'),link:'LiveT'},
  {id:"2",type : "JOIN TOURNAMENT",image : require('../assets/images/bg-logo.jpg'),link:'JoinTournament'},
  {id:"3",type : "ADD TOURNAMENT",image : require('../assets/images/bg-logo.jpg'),link:'SignUp'},
  {id:"4",type : "MATCH HUB",image : require('../assets/images/bg-logo.jpg')},
]

  return (
 <LinearGradient colors={['#7ff5a1','#c8e6d2']} style={{flex:1}}>
        <Text style={{fontFamily:'Bangers',fontSize:60,color:'black'}} className='text-center'>JOIN{'\n'}TOURNAMENTS</Text>
      <FlatList
      data={display}
      keyExtractor={(match) => match.id}
      contentContainerStyle={{flexGrow:1}}
      renderItem={({item}) =>
        <TouchableOpacity onPress={() => router.push(`/${item.link}`)}>
        <ImageBackground source={item.image} style={styles.card} imageStyle={styles.image}>
          <View style={styles.overlay}>
            <Text style={styles.text}>{item.type}</Text>
          </View>
        </ImageBackground>
        </TouchableOpacity>
      }
      style={{marginBottom:30}}/>
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
    marginTop:30,
    width:320, 
    height: 190,
    borderRadius: 16,
    overflow:"hidden",
    marginLeft:38
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.7)', 
  },
  title: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderColor: '#A4DE02',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderWidth: 2,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  greenBorder: {
    opacity:0.8,
    borderColor: 'rgba(16, 185, 129, 0.5)',
    shadowColor: '#10B981',
    
  },
});
