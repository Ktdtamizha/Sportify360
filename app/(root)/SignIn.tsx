import React, { useState } from 'react';
import { View, Text, TextInput, ImageBackground ,TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';



export default function SignIn () { 

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!username || !password) {
      Alert.alert('Please fill in all fields!');
      return;
    }
    Alert.alert('Login Successful.!');
    router.push('/Organize');
  };
  
 return (
 <View style={styles.container}>
 <StatusBar backgroundColor='#16b8c9' />
 <ImageBackground style={styles.image}>
 <Text style={styles.text}> Login </Text>
 <TextInput style={styles.textInput} placeholder="Enter Username"  placeholderTextColor="white" value={username}
          onChangeText={setUsername}/>
 <TextInput style={styles.textInput} placeholder=" Enter Password" placeholderTextColor="white"  secureTextEntry
          value={password}
          onChangeText={setPassword}/>
 <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.btnLogin}>Submit</Text>
 </TouchableOpacity>

  <TouchableOpacity onPress={() => router.replace('/SignUp')}>
      <Text style={styles.stext}>Do not have an account.?   SignUp</Text>
  </TouchableOpacity>

 </ImageBackground>
 </View>
 );
}

const styles = StyleSheet.create({
 container: {
  backgroundColor: 'black',
  flex: 1,
  paddingTop: 20,
  paddingHorizontal: 20,
 },
 image: {
    width: 400,  
    height: 930,  
    alignSelf: 'center', 
    resizeMode: 'cover',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    marginTop: 100,
    fontSize: 40,
    fontWeight: 'bold',
  },
  textInput: {
    color: 'white',
    borderColor: 'white',
    borderWidth: 2,
    padding: 10,
    borderRadius: 15,
    marginTop: 50,
    width: '80%',  
    alignSelf: 'center',
 },
  btnLogin: {
    backgroundColor: 'black',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 15,
    padding: 15,
    width: '60%', 
    marginTop: 50,
    alignSelf: 'center',
    },
  stext: {
    margin: 24,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
 });