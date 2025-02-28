import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.jsx';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

const TournamentMatchesScreen = () => {
  const { tournamentId } = useLocalSearchParams();
  const [Matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const matchesRef = collection(db, 'matches');
    const q = query(matchesRef, where('tournamentId', '==', tournamentId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const matchesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMatches(matchesList);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, [tournamentId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={Matches}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.matchCard}>
              <Text style={styles.matchTitle}>{item.team1} vs {item.team2}</Text>
              <View style={styles.infoRow}>
                <MaterialIcons name="calendar-today" size={16} color="#666" />
                <Text style={styles.matchDate}>
                  {item.date ? item.date.toDate().toLocaleString() : 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="sports" size={16} color="#666" />
                <Text style={styles.matchStatus}>Status: {item.status}</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>
                  {item.team1Score} - {item.team2Score}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.noData}>
              <Text style={styles.noDataText}>No matches found for this tournament.</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  matchCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  matchStatus: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  scoreContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  },
});

export default TournamentMatchesScreen;