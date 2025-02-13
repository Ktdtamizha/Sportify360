import { View, Text, StatusBar, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const OrgDashboard = () => {

    const bgImage = require('../assets/images/bg-logo.jpg'); 

  return (
    
      <SafeAreaView style={styles.container}>
        
        <Text style={styles.title}>ORGANIZE TOURNAMENT</Text>

        <View style={styles.buttonContainer}>

          <TouchableOpacity activeOpacity={0.85} style={[styles.button, styles.greenBorder]}>
            <Link href="/">
              <Text style={styles.buttonText}>ADMIN</Text>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} style={[styles.button, styles.greenBorder]}>
            <Link href="/">
              <Text style={styles.buttonText}>START MATCH</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  )
}

export default OrgDashboard;


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
    paddingVertical:20,
    backgroundColor: 'black', 
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
    textAlign: 'center',
  },
  greenBorder: {
    opacity:0.8,
    borderColor: 'rgba(16, 185, 129, 0.9)',
    shadowColor: '#10B981',
    
  },
});
