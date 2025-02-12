import { Link } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const bgImage = require('../assets/images/stadium.jpg'); 

export default function Profile() {
  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        
        <Text style={styles.title}>ENTER THE ARENA</Text>

        <View style={styles.buttonContainer}>

          <TouchableOpacity activeOpacity={0.85} style={[styles.button, styles.greenBorder]}>
            <Link href="/LiveT">
              <Text style={styles.buttonText}>VIEW TOURNAMENTS</Text>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} style={[styles.button, styles.greenBorder]}>
            <Link href="/SignUp">
              <Text style={styles.buttonText}>ORGANIZE TOURNAMENT</Text>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} style={[styles.button, styles.greenBorder]}>
            <Link href="/SignUp">
              <Text style={styles.buttonText}>JOIN TOURNAMENT</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
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
