import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TournamentDetails({ route }) {
  const [tournament, setTournament] = useState(null);
  const id = route?.params?.id;

  useEffect(() => {
    if (!id) {
      Alert.alert("Error", "Tournament ID not found.");
      return;
    }

    const docRef = doc(db, 'Tournaments', id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setTournament({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert('Error', 'Tournament not found');
      }
    });

    return () => unsubscribe();
  }, [id]);

  const updateTeamStatus = async (teamIndex, status) => {
    console.log(`Updating team ${teamIndex} to status: ${status}`);
    if (!tournament || !tournament.participants) return;
  
    // Get the team being updated
    const teamToUpdate = tournament.participants[teamIndex];
  
    // Prevent approving more teams than allowed
    if (status === 'approved' && tournament.acceptedTeams.length >= tournament.maxTeams) {
      Alert.alert('Error', 'Max teams limit reached!');
      return;
    }
  
    // Update participants array
    const updatedParticipants = tournament.participants.map((team, index) =>
      index === teamIndex ? { ...team, status } : team
    );
  
    // Handle approved teams
    let updatedAcceptedTeams = [...tournament.acceptedTeams];
    if (status === 'approved') {
      updatedAcceptedTeams.push(teamToUpdate);
    } else {
      updatedAcceptedTeams = updatedAcceptedTeams.filter(t => t.userId !== teamToUpdate.userId);
      // If rejected, remove tournament from AsyncStorage for that user
      await removeTournamentFromUser(teamToUpdate.userId);
    }
  
    try {
      await updateDoc(doc(db, 'Tournaments', id), {
        participants: updatedParticipants,
        acceptedTeams: updatedAcceptedTeams
      });
  
      setTournament(prev => ({
        ...prev,
        participants: updatedParticipants,
        acceptedTeams: updatedAcceptedTeams
      }));
    } catch (error) {
      console.error('Error updating team status:', error);
      Alert.alert('Error', 'Failed to update team status');
    }
  };
  
  // Function to remove tournament from AsyncStorage for a rejected user
  const removeTournamentFromUser = async (userId) => {
    try {
      const key = `joinedTournaments_${userId}`;
      const storedData = await AsyncStorage.getItem(key);
  
      if (storedData) {
        let joinedTournaments = JSON.parse(storedData);
        joinedTournaments = joinedTournaments.filter(tournamentId => tournamentId !== id);
  
        await AsyncStorage.setItem(key, JSON.stringify(joinedTournaments));
        console.log(`Tournament ${id} removed from user's joined list.`);
      }
    } catch (error) {
      console.error('Error removing tournament from AsyncStorage:', error);
    }
  };
  
  
  return (
    <View style={{ flex: 1, padding: 20 }}>
      {tournament ? (
        <>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{tournament.name}</Text>
          <Text>Sport: {tournament.sport}</Text>
          <Text>Location: {tournament.location}</Text>

          <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>Teams</Text>
          <FlatList
            data={tournament.participants || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={{ padding: 10, borderBottomWidth: 1 }}>
                <Text>{item.name}</Text>
                <Text>Status: {item.status}</Text>
                {tournament.adminId === auth.currentUser?.uid && item.status === 'pending' && (
                  <>
                    <TouchableOpacity onPress={() => updateTeamStatus(index, 'approved')}>
                      <Text style={{ color: 'green' }}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>{console.log(`Reject button pressed for team index: ${index}`), updateTeamStatus(index, 'rejected')}}>
                      <Text style={{ color: 'red' }}>Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          />
        </>
      ) : (
        <Text>Loading tournament details...</Text>
      )}
    </View>
  );
}
