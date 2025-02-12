import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';


export default function SignUp() { 

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}$/;
  const passwordLength = password.length >= 3 && password.length <= 10;

  const handleSubmit = () => {

    if (!username || !email || !password) {
      Alert.alert('Please fill in all fields!');
      return;
    }

    if(!emailRegex.test(email)){
       Alert.alert('Invalid email.!', 'Please enter a valid email id.');
       return;
    }

    if (!passwordLength) {
      Alert.alert('Invalid password!', 'Password must be between 3 and 10 characters.');
      return;
    }
    Alert.alert('Sign-Up Successful.!');
    router.push('/Organize');
  };
  
 return (
 <View style={styles.container}>
 <Text style={styles.text}> Sign Up </Text>
 <TextInput style={styles.textInput} placeholder="Enter Username" placeholderTextColor="white" value={username}
          onChangeText={setUsername}/>
 <TextInput style={styles.textInput} placeholder="Enter Email" placeholderTextColor="white"  keyboardType="email-address"
          value={email}
          onChangeText={setEmail}/>
 <TextInput style={styles.textInput} placeholder=" Enter Password" placeholderTextColor="white" secureTextEntry
          value={password}
          onChangeText={setPassword}/>
 <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.btnLogin}>Submit</Text>
 </TouchableOpacity>
        <Link href="/SignIn">
              <Text style={styles.stext}>Already have an account..? Login</Text>
         </Link>
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