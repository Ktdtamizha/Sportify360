import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { getDistance } from 'geolib';
import { ScrollView, View, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

export default function NearbyTournamentsScreen() {
  const [nearbyTournaments, setNearbyTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(30000); // 30km
  const [userCoords, setUserCoords] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchNearby = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserCoords(coords);

      const snapshot = await getDocs(collection(db, 'Tournaments'));
      const allTournaments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = allTournaments
        .map((tournament) => {
          if (!tournament.coordinates?.latitude || !tournament.coordinates?.longitude) return null;

          const distance = getDistance(coords, tournament.coordinates);
          return { ...tournament, distance };
        })
        .filter((t) => t && t.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

      setNearbyTournaments(filtered);
      setLoading(false);
    };

    fetchNearby();
  }, [radius]);

  if (loading || !userCoords) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Finding tournaments near you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Toggle Button */}
      <TouchableOpacity
      style={styles.toggleButton}
      onPress={() => navigation.navigate('Upcoming')}
      >
        <Text style={styles.toggleButtonText}>All Matches</Text>
    </TouchableOpacity>


      <Text style={styles.heading}>Nearby Tournaments</Text>

      <Picker
        selectedValue={radius}
        onValueChange={(value) => setRadius(value)}
        style={styles.picker}
      >
        <Picker.Item label="10 km" value={10000} />
        <Picker.Item label="25 km" value={25000} />
        <Picker.Item label="30 km" value={30000} />
        <Picker.Item label="50 km" value={50000} />
        <Picker.Item label="100 km" value={100000} />
      </Picker>

      <ScrollView>
        {nearbyTournaments.map((tourney) => (
          <View key={tourney.id} style={styles.card}>
            <Text style={styles.title}>{tourney.name}</Text>
            <Text style={styles.location}>{tourney.location}</Text>
            <Text style={styles.distance}>
              Distance: {(tourney.distance / 1000).toFixed(2)} km
            </Text>
          </View>
        ))}
        {nearbyTournaments.length === 0 && (
          <Text style={styles.noResult}>No tournaments found in this range.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#F7F9FC',
    flex: 1,
    marginTop:70
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  picker: {
    height: 50,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  location: {
    color: '#555',
    marginTop: 4,
  },
  distance: {
    marginTop: 6,
    color: '#007AFF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  noResult: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
