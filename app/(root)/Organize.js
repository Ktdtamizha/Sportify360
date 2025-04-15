import React, { useState, useEffect } from 'react';
import {
  Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, View, ActivityIndicator,
} from 'react-native';
import 'react-native-get-random-values';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, addDoc, Timestamp, writeBatch, doc } from 'firebase/firestore';
import { db, auth } from '../../utils/firebase';
import RNPickerSelect from 'react-native-picker-select';
import { v4 as uuidv4 } from 'uuid';
import * as Location from 'expo-location';

export default function OrganizeScreen() {
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    location: '',
    coordinates: {
      latitude: null,
      longitude: null,
    },
    maxParticipants: '',
    prize: '',
    contactInfo: '',
    startDate: new Date(),
    endDate: new Date(),
  });  

  const [showPicker, setShowPicker] = useState({ key: null });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getLocationAutomatically();
  }, []);

  const getLocationAutomatically = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to auto-fill location.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (geocode.length > 0) {
        const place = geocode[0];
        const fullAddress = `${place.city || ''}, ${place.region || ''}`;
        setFormData((prev) => ({
          ...prev,
          location: fullAddress,
          coordinates: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        }));
      }
    } catch (error) {
      console.error('Location Error:', error);
      Alert.alert('Error', 'Unable to fetch location');
    }
  };

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
        ...formData,
        maxParticipants: Number(formData.maxParticipants),
        prize: Number(formData.prize),
        startDate: Timestamp.fromDate(formData.startDate),
        endDate: Timestamp.fromDate(formData.endDate),
        adminId: auth.currentUser.uid,
        createdAt: Timestamp.now(),
        currentRound: 1,
        totalRounds: Math.log2(Number(formData.maxParticipants)),
        hasByes: false,
        status: 'upcoming',
        type: 'knockout',
        participantsCount: 0,
        teamsCount: 0,
        coordinates: formData.coordinates,
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

      Alert.alert('Success', 'Tournament Created Successfully!');
      router.push('LiveT');
    } catch (error) {
      console.error('Error creating tournament:', error);
      Alert.alert('Error', 'Failed to create tournament.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMatches = async (tournamentId, maxParticipants) => {
    const totalRounds = Math.log2(maxParticipants);
    const batch = writeBatch(db);

    let previousRoundMatches = [];

    for (let i = 0; i < maxParticipants / 2; i++) {
      const matchId = uuidv4();
      const matchRef = doc(db, 'Tournaments', tournamentId, 'matches', matchId);
      const matchData = {
        matchId,
        round: 1,
        player1: null,
        player2: null,
        team1: null,
        team2: null,
        winner: null,
        nextMatch: null,
        status: 'scheduled',
      };

      previousRoundMatches.push(matchData);
      batch.set(matchRef, matchData);
    }

    for (let round = 2; round <= totalRounds; round++) {
      const currentRoundMatches = [];

      for (let i = 0; i < previousRoundMatches.length / 2; i++) {
        const matchId = uuidv4();
        const matchRef = doc(db, 'Tournaments', tournamentId, 'matches', matchId);
        const matchData = {
          matchId,
          round,
          player1: null,
          player2: null,
          team1: null,
          team2: null,
          winner: null,
          nextMatch: null,
          status: 'pending',
          previousMatches: [
            previousRoundMatches[i * 2].matchId,
            previousRoundMatches[i * 2 + 1].matchId,
          ],
        };

        currentRoundMatches.push(matchData);
        batch.set(matchRef, matchData);
      }

      previousRoundMatches.forEach((match, index) => {
        const nextMatch = currentRoundMatches[Math.floor(index / 2)];
        if (nextMatch) {
          batch.update(doc(db, 'Tournaments', tournamentId, 'matches', match.matchId), {
            nextMatch: nextMatch.matchId,
          });
        }
      });

      previousRoundMatches = currentRoundMatches;
    }

    const tournamentRef = doc(db, 'Tournaments', tournamentId);
    batch.update(tournamentRef, {
      totalRounds,
      currentRound: 1,
    });

    await batch.commit();
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
          placeholder={{ label: 'Choose any sport', value: null }}
          value={formData.sport}
        />

        <Text style={styles.text}>Location (Auto-filled)</Text>
        <TextInput
          style={styles.iText}
          placeholder="Fetching your location..."
          value={formData.location}
          onChangeText={(value) => handleInputChange('location', value)}
          placeholderTextColor="black"
        />

        <Text style={styles.text}>Max Participants</Text>
        <TextInput
          style={styles.iText}
          placeholder="Enter max participants (2, 4, 8, 16)"
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
          placeholder="Enter 10-digit phone number"
          value={formData.contactInfo}
          onChangeText={(value) => handleInputChange('contactInfo', value)}
          keyboardType="phone-pad"
          maxLength={10}
          placeholderTextColor="black"
        />

        {['startDate', 'endDate'].map((key, index) => (
          <View key={index}>
            <Text style={styles.text}>{key.replace('Date', ' Date')}</Text>
            <TouchableOpacity onPress={() => setShowPicker({ key })}>
              <TextInput
                style={styles.iText}
                value={formData[key].toDateString()}
                editable={false}
              />
            </TouchableOpacity>
            {showPicker.key === key && (
              <DateTimePicker
                value={formData[key]}
                mode="date"
                onChange={(e, date) => handleDateChange(key, e, date)}
              />
            )}
          </View>
        ))}

        <TouchableOpacity onPress={handleSubmit} disabled={isLoading}>
          <Text style={styles.btnLogin}>
            {isLoading ? <ActivityIndicator color="white" /> : 'Submit'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hText: {
    color: 'green',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  text: {
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 15,
    marginTop: 10,
  },
  iText: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 2,
    color: 'black',
    fontSize: 15,
    margin: 10,
  },
  btnLogin: {
    backgroundColor: 'green',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 15,
    padding: 15,
    width: '60%',
    margin: 10,
    alignSelf: 'center',
  },
});

const pickerSelectStyles = {
  inputAndroid: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
    fontSize: 15,
    padding: 10,
    margin: 10,
    color: 'black',
  },
  placeholder: {
    color: 'gray',
    fontSize: 15,
  },
};
