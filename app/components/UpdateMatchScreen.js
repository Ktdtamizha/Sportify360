import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase.js';
import { useState, useEffect } from 'react';
import { saveMatchResult } from '../../utils/saveMatchResult.js';


const UpdateMatchScreen = () => {
  const { tournamentId, matchId } = useLocalSearchParams();
  const [match, setMatch] = useState(null);
  const [winner, setWinner] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const matchRef = doc(db, 'Tournaments', tournamentId, 'matches', matchId);
        const docSnap = await getDoc(matchRef);
        if (docSnap.exists()) {
          setMatch({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching match:', error);
      }
      setLoading(false);
    };
    fetchMatch();
  }, [matchId]);
  
  // Inside your component
  const handleSaveResult = async () => {
    setUpdating(true);
    const success = await saveMatchResult({ tournamentId, match, matchId, winner });
    setUpdating(false);
    if (success) router.back();
  };

  if (loading || !match) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginTop: 50 }}>
        Update Match (Round {match.round})
      </Text>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>Select the winner:</Text>
        {[match.team1, match.team2].map((team, index) => (
          <TouchableOpacity
            key={index}
            style={{
              padding: 15,
              marginVertical: 5,
              backgroundColor: winner === team ? '#e3f2fd' : '#f5f5f5',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: winner === team ? '#2196F3' : '#e0e0e0'
            }}
            onPress={() => setWinner(team)}
          >
            <Text style={{ textAlign: 'center', fontWeight: '500' }}>{team || 'TBD'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: winner ? '#4CAF50' : '#9E9E9E',
          borderRadius: 8,
          alignItems: 'center'
        }}
        onPress={handleSaveResult}
        disabled={!winner || updating}
      >
        {updating ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Save Result</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UpdateMatchScreen;
