import React, { useState } from 'react';
import {
  Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, View, ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, addDoc, Timestamp, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import RNPickerSelect from 'react-native-picker-select';

export default function OrganizeScreen() {
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    location: '',
    maxParticipants: '',
    prize: '',
    contactInfo: '',
    startDate: new Date(),
    endDate: new Date(),
  });

  const [showPicker, setShowPicker] = useState({ key: null });
  const [isLoading, setIsLoading] = useState(false);


  const handleDateChange = (key, event, selectedDate) => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, [key]: selectedDate }));
    }
    setShowPicker({ key: null });
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const { name, sport, location, maxParticipants, contactInfo, startDate, endDate } = formData;

    if (!name || !sport || !location || !maxParticipants || !contactInfo) {
      Alert.alert('Error', 'Please fill all required fields.');
      return false;
    }

    if (!isPowerOfTwo(Number(maxParticipants))) {
      Alert.alert('Error', 'Max Participants must be a power of 2 (e.g., 2, 4, 8, 16).');
      return false;
    }

    if (endDate <= startDate) {
      Alert.alert('Error', 'End date must be after the start date.');
      return false;
    }

    if (!/^\d{10}$/.test(contactInfo)) {
      Alert.alert('Error', 'Contact info must be a valid 10-digit phone number.');
      return false;
    }

    return true;
  };

  const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to create a tournament.');
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const tournamentRef = await addDoc(collection(db, 'Tournaments'), {
        name: formData.name,
        sport: formData.sport,
        location: formData.location,
        maxParticipants: Number(formData.maxParticipants),
        prize: Number(formData.prize),
        contactInfo: formData.contactInfo,
        startDate: Timestamp.fromDate(formData.startDate),
        endDate: Timestamp.fromDate(formData.endDate),
        adminId: auth.currentUser.uid, 
        createdAt: Timestamp.fromDate(new Date()),
        currentRound: 1, 
        totalRounds: Math.log2(Number(formData.maxParticipants)), 
        hasByes: false, 
        status: 'upcoming',
        type: 'knockout', 
        participantsCount: 0,
        teamsCount:0 
      });

      const participantsRef = collection(db, 'Tournaments', tournamentRef.id, 'participants');
      for (let i = 1; i <= Number(formData.maxParticipants); i++) {
        await addDoc(participantsRef, {
          user: null, 
          seed: i,
          isBye: false,
          eliminated: false,
          team: null,
        });
      }

      await generateMatches(tournamentRef.id, Number(formData.maxParticipants));

      Alert.alert('Success', `Tournament Created! ID: ${tournamentRef.id}`);
      router.push('LiveT');
    } catch (error) {
      Alert.alert('Error', 'Failed to create tournament.');
      console.error('Firestore Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMatches = async (tournamentId, maxParticipants) => {
    const totalRounds = Math.log2(maxParticipants);

    for (let i = 0; i < maxParticipants / 2; i++) {
      await addDoc(collection(db, 'Tournaments', tournamentId, 'matches'), {
        round: 1,
        matchId: `R1-M${i + 1}`,
        player1: null,
        player2: null,
        team1: null,
        team2: null,
        winner: null,
        nextMatch: `R2-M${Math.floor(i / 2) + 1}`,
        status: 'scheduled',
      });
    }

    for (let round = 2; round <= totalRounds; round++) {
      const matchesInRound = Math.pow(2, totalRounds - round);
      for (let i = 0; i < matchesInRound; i++) {
        await addDoc(collection(db, 'Tournaments', tournamentId, 'matches'), {
          round: round,
          matchId: `R${round}-M${i + 1}`,
          player1: null,
          player2: null,
          team1: null,
          team2: null,
          winner: null,
          status: 'pending',
        });
      }
    }
  };

  return (
      <LinearGradient colors={['#f0fbef', '#c0efbb']} style={{ flex: 1 }}>
          <ScrollView style={{ marginTop: 90 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.hText}>Organize Tournament</Text>

              <Text style={styles.text}>Tournament Name</Text>
              <TextInput
                style={styles.iText}
                placeholder="Enter tournament name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholderTextColor="black"
              />

              <Text style={styles.text}>Select Sport</Text>
              <RNPickerSelect
                onValueChange={(value) => handleInputChange('sport', value)}
                items={[
                  { label: 'Cricket', value: 'Cricket' },
                  { label: 'Volleyball', value: 'Volleyball' },
                  { label: 'Football', value: 'Football' },
                ]}
                style={pickerSelectStyles}
                placeholder={{ label: "Choose any sport", value: null }}
              />

              <Text style={styles.text}>Location</Text>
              <TextInput
                style={styles.iText}
                placeholder="Enter location"
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholderTextColor="black"
              />

              <Text style={styles.text}>Max Participants</Text>
              <TextInput
                style={styles.iText}
                placeholder="Enter max participants (e.g., 2, 4, 8, 16)"
                value={formData.maxParticipants}
                onChangeText={(value) => handleInputChange('maxParticipants', value)}
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
                placeholder="Enter contact info (10 digits)"
                value={formData.contactInfo}
                onChangeText={(value) => handleInputChange('contactInfo', value)}
                placeholderTextColor="black"
                keyboardType="phone-pad"
                maxLength={10}
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
           

              <TouchableOpacity
                onPress={() => {
                  handleSubmit();
                }}
                disabled={isLoading}
              >
                <Text style={styles.btnLogin}>
                  {isLoading ? <ActivityIndicator color="white" /> : 'Submit'}
                </Text>
              </TouchableOpacity>
          </ScrollView>
      </LinearGradient>
    
  );
}

const styles = StyleSheet.create({
  hText: { color: 'green', textAlign: 'center', fontSize: 30, fontWeight: 'bold', marginTop: 20 },
  text: { paddingHorizontal: 10, color: 'black', fontSize: 15, marginTop: 10 },
  iText: { padding: 10, borderColor: 'black', borderWidth: 2, color: 'black', fontSize: 15, margin: 10 },
  btnLogin: { backgroundColor: 'green', color: 'white', textAlign: 'center', fontWeight: 'bold', borderRadius: 15, padding: 15, width: '60%', margin: 10, alignSelf: 'center' },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
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