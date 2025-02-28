import React, { useState } from 'react';
import { 
  Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import RNPickerSelect from 'react-native-picker-select';
import { auth } from '../firebase';

export default function OrganizeScreen() {
  const [formData, setFormData] = useState({
    sport:'',
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    location: '',
    maxTeams: 0,
    prize: 0,
    contactInfo: 0,
  });

  const [showPicker, setShowPicker] = useState({ key: null });

  const handleDateChange = (key, event, selectedDate) => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, [key]: selectedDate }));
    }
    setShowPicker({ key: null }); 
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to create a tournament.');
      return;
    }
  
    if (!formData.name || !formData.location || !formData.maxTeams || !formData.contactInfo) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
  
    try {
      const docRef = await addDoc(collection(db, 'Tournaments'), {
        sport: formData.sport,
        name: formData.name,
        startDate: Timestamp.fromDate(formData.startDate),
        endDate: Timestamp.fromDate(formData.endDate),
        location: formData.location,
        maxTeams: formData.maxTeams,  
        prize: formData.prize,      
        contactInfo: formData.contactInfo,
        adminId: auth.currentUser.uid,
        participants:[],
        acceptedTeams:[],
      });
  
      Alert.alert('Success', `Tournament Created! ID: ${docRef.id}`);
      router.push('LiveT');
    } catch (error) {
      Alert.alert('Error', 'Failed to create tournament.');
      console.error('Firestore Error:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={['#f0fbef', '#c0efbb']} style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
          <ScrollView style={{ marginTop: 90}} showsVerticalScrollIndicator={false}>
            <Text style={styles.hText}>Organize Tournament</Text>
            <Text style={{marginLeft:14,marginTop:10,fontSize:16}}>Select Sport</Text>
              <RNPickerSelect 
              onValueChange={(value)=>setFormData((prev) => ({...prev,sport:value}))}
              items={[
                {label:'Cricket',value:'Cricket'},
                {label:'Volleyball',value:'Volleyball'},
                {label:'Football',value:'Football'},
              ]}
              style={pickerSelectStyles}
              placeholder={{label:"Choose any sport",value:null}}/>
            <Text style={styles.text}>Tournament Name</Text>
            <TextInput
              style={styles.iText}
              placeholder="Enter tournament name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholderTextColor="black"
            />

            {['startDate', 'endDate'].map((key, index) => (
              <View key={index}>
                <Text style={styles.text}>{key.replace('Date', ' Date')}</Text>
                <TouchableOpacity onPress={() => setShowPicker({ key })}>
                  <TextInput style={styles.iText} value={formData[key].toDateString()} editable={false} />
                </TouchableOpacity>
                {showPicker.key === key && (
                  <DateTimePicker value={formData[key]} mode="date" onChange={(e, date) => handleDateChange(key, e, date)} />
                )}
              </View>
            ))}

            <Text style={styles.text}>Location</Text>
            <TextInput
              style={styles.iText}
              placeholder="Enter location"
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              placeholderTextColor="black"
            />

            <Text style={styles.text}>Max No of Teams</Text>
            <TextInput
              style={styles.iText}
              placeholder="Enter max teams"
              value={formData.maxTeams}
              onChangeText={(value) => handleInputChange('maxTeams', value)}
              keyboardType="numeric"
              placeholderTextColor="black"
            />

            <Text style={styles.text}>Prize Details</Text>
            <TextInput
              style={styles.iText}
              placeholder="Enter prize amount"
              value={formData.prize}
              onChangeText={(value) => handleInputChange('prize', value)}
              keyboardType="numeric"
              placeholderTextColor="black"
            />

            <Text style={styles.text}>Contact Information</Text>
            <TextInput
              style={styles.iText}
              placeholder="Enter contact info"
              value={formData.contactInfo}
              onChangeText={(value) => handleInputChange('contactInfo', value)}
              placeholderTextColor="black"
              keyboardType="phone-pad"
            />

            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.btnLogin}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  hText: { color: 'green', textAlign: 'center', fontSize: 30, fontWeight: 'bold', marginTop: 20 },
  text: { paddingHorizontal: 10, color: 'black', fontSize: 15, marginTop: 10 },
  iText: { padding: 10, borderColor: 'black', borderWidth: 2, color: 'black', fontSize: 15, margin: 10 },
  btnLogin: { backgroundColor: 'green', color: 'white', textAlign: 'center', fontWeight: 'bold', borderRadius: 15, padding: 15, width: '60%', margin: 10, alignSelf: 'center' },
});
const pickerSelectStyles = {
  inputAndroid: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
    fontSize: 15,
    backgroundColor: 'transparent',
  },
  placeholder: {
    color: 'gray',
    fontSize: 15,
  },
};
