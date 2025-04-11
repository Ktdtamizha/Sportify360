import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../utils/firebase.js';
import { router } from 'expo-router';

const AdminTournamentsScreen = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const tournamentsRef = collection(db, 'Tournaments');
    const q = query(tournamentsRef, where('adminId', '==', auth.currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tournamentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTournaments(tournamentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderTournamentItem = useCallback(({ item }) => (
    <TouchableOpacity
    style={{
      padding: 16,
      marginBottom: 12,
      width: 220,
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 12,
      backgroundColor: '#fff'
    }}
      onPress={() => router.push(`/components/MatchResultModal?tournamentId=${item.id}`)}
    >
      <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'black' }}>{item.name}</Text>
      <Text style={{ color: 'black', marginTop: 4}}>Status: {item.status}</Text>
      <Text style={{ color: 'black' }}>
        Participants: {item.participantsCount}/{item.maxParticipants}
      </Text>
      <Text style={{fontWeight:'600',fontSize:16,color:'green'}}>{item.winner} Won the Tournament</Text>

    </TouchableOpacity>
  ), []);

  return (
    <View style={{ flex: 1, paddingTop: 90, alignItems: 'center'}}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 16, color: 'black' ,marginTop:40}}>
        My Tournaments
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="white" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={tournaments}
          keyExtractor={(item) => item.id}
          renderItem={renderTournamentItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={{ color: 'gray', fontSize: 18 }}>No tournaments created yet</Text>}
        />
      )}
    </View>
  );
};

export default AdminTournamentsScreen;
