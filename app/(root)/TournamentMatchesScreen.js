import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useLocalSearchParams } from 'expo-router';

const MatchesPage = () => {
  const { tournamentId } = useLocalSearchParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const matchesRef = collection(db, 'Tournaments', tournamentId, 'matches');
    const q = query(matchesRef);

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
    <View style={styles.container}>
      <Text style={styles.title}>Matches</Text>
      <FlatList
        data={matches}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.matchCard}>
            <Text style={styles.matchDetails}>
              {item.team1 || 'TBD'} vs {item.team2 || 'TBD'}
            </Text>
            <Text style={styles.matchStatus}>Status: {item.status}</Text>
            {item.winner && (
              <Text style={styles.winnerText}>Winner: {item.winner}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>No matches found for this tournament.</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop:40
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
  matchDetails: {
    fontSize: 26,
    fontWeight:'600',
    color: '#444',
    marginBottom: 8,
  },
  matchStatus: {
    fontSize: 14,
    color: '#666',
  },
  winnerText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 8,
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

export default MatchesPage;