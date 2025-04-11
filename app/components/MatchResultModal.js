import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { router, useLocalSearchParams } from 'expo-router';

const AdminMatchesScreen = () => {
  const { tournamentId } = useLocalSearchParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [matchesByRound, setMatchesByRound] = useState({});

  useEffect(() => {
    const tournamentRef = doc(db, 'Tournaments', tournamentId);
    const matchesRef = collection(db, 'Tournaments', tournamentId, 'matches');

    const unsubscribeTournament = onSnapshot(tournamentRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setTournament(data);
        setCurrentRound(data?.currentRound || 1);
      }
    });

    const matchesQuery = query(
      matchesRef,
      where('round', '<=', currentRound + 1)
    );

    const unsubscribeMatches = onSnapshot(matchesQuery, (snapshot) => {
      const matchesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMatches(matchesData);
      
      const organized = {};
      matchesData.forEach(match => {
        if (!organized[match.round]) {
          organized[match.round] = [];
        }
        organized[match.round].push(match);
      });
      setMatchesByRound(organized);
      setLoading(false);
    });

    return () => {
      unsubscribeTournament();
      unsubscribeMatches();
    };
  }, [tournamentId, currentRound]);

  const handleMatchPress = (match) => {
    if (match.status !== 'completed') {

      
      router.push({
        pathname: '/components/ScorerScreen',
        params: {
          tournamentId,
          matchId: match.id,
          round: match.round,
          team1: match.team1 || 'TBD',
          team2: match.team2 || 'TBD'
        }
      });
    } else {
      Alert.alert('Match already completed');
    }
  };
  

  if (loading || !tournament) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tournament.name}</Text>

      {Object.entries(matchesByRound).map(([round, roundMatches]) => (
        <View key={round} style={styles.roundContainer}>
          <Text style={styles.roundTitle}>Round {round}</Text>
          <FlatList
            data={roundMatches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.matchCard,
                  item.status === 'completed' ? styles.completedMatch : styles.upcomingMatch
                ]}
                onPress={() => handleMatchPress(item)}
              >
                <Text style={styles.teams}>
                  {item.team1 || 'TBD'} vs {item.team2 || 'TBD'}
                </Text>
                <Text style={styles.completeHint}>Tap to start scoring</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No matches found for Round {round}</Text>
            }
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    marginTop:40
  },
  roundContainer: {
    marginBottom: 20
  },
  roundTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  matchCard: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1
  },
  completedMatch: {
    backgroundColor: '#e8f5e9',
    borderColor: '#a5d6a7'
  },
  upcomingMatch: {
    backgroundColor: '#fff8e1',
    borderColor: '#ffe082'
  },
  matchId: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  teams: {
    fontSize: 20,
    fontWeight:'600',
    marginBottom: 4
  },
  status: {
    fontStyle: 'italic',
    color: '#666'
  },
  winner: {
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 4
  },
  completeHint: {
    color: '#1976d2',
    marginTop: 4,
    fontStyle: 'italic'
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#999'
  }
});

export default AdminMatchesScreen;
