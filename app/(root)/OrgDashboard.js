import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import { collection, doc, updateDoc, deleteDoc, onSnapshot, getDocs, getDoc, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AdminPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const tournamentsRef = collection(db, 'Tournaments');

    const unsubscribeTournaments = onSnapshot(
      tournamentsRef,
      (querySnapshot) => {
        const tournamentsList = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((tournament) => tournament.adminId === auth.currentUser?.uid);

        setTournaments(tournamentsList);
        setIsAdmin(tournamentsList.length > 0); 
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching tournaments:', error);
        Alert.alert('Error', 'Failed to fetch tournaments.');
        setLoading(false);
      }
    );

    return () => unsubscribeTournaments();
  }, []);

  const updateTeamStatus = async (tournamentId, teamId, status, setTeams) => {
    try {
      const teamRef = doc(db, 'Tournaments', tournamentId, 'teams', teamId);

      if (status === 'approved') {
        await assignTeamToMatch(tournamentId, teamId);
        await updateDoc(teamRef, {
          status: 'approved',
        });
        Alert.alert('Success', 'Team approved and assigned to a match.');
      } else if (status === 'rejected') {
        await deleteDoc(teamRef);
        Alert.alert('Success', 'Team rejected and removed.');
      }

      setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
    } catch (error) {
      console.error('Error updating team status:', error);
      Alert.alert('Error', 'Failed to update team status.');
    }
  };

  const assignTeamToMatch = async (tournamentId, teamId) => {
    const teamsRef = doc(db, 'Tournaments', tournamentId, 'teams', teamId);
    const teamDoc = await getDoc(teamsRef);

    if (!teamDoc.exists()) {
      console.error('Team document does not exist');
      return;
    }

    const teamData = teamDoc.data();
    try {
      const matchesRef = collection(db, 'Tournaments', tournamentId, 'matches');
      const querySnapshot = await getDocs(matchesRef);
      let assigned = false;

      for (const matchDoc of querySnapshot.docs) {
        const matchData = matchDoc.data();
        const matchRef = doc(db, 'Tournaments', tournamentId, 'matches', matchDoc.id);

        if (matchData.team1 === null || matchData.team1 === '') {
          await updateDoc(matchRef, {
            player1: teamId,
            team1: teamData.name,
          });
          assigned = true;
          break;
        } else if (matchData.team2 === null || matchData.team2 === '') {
          await updateDoc(matchRef, {
            player2: teamId,
            team2: teamData.name,
          });
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        Alert.alert('Error', 'No available matches to assign the team.');
        return;
      }

      const tournamentRef = doc(db, 'Tournaments', tournamentId);
      const tournamentDoc = await getDoc(tournamentRef);
      const tournamentData = tournamentDoc.data();

      await updateDoc(tournamentRef, {
        participantsCount: tournamentData.participantsCount + 1,
      });
    } catch (error) {
      console.error('Error assigning team to match:', error);
      Alert.alert('Error', 'Failed to assign team to match.');
    }

    const participantsRef = collection(db, 'Tournaments', tournamentId, 'participants');
    const initializedParticipantsQuery = query(participantsRef, where('user', '==', null));
    const initializedParticipantsSnapshot = await getDocs(initializedParticipantsQuery);

    if (initializedParticipantsSnapshot.empty) {
      Alert.alert('Error', 'No available slots to join.');
      return;
    }

    const firstAvailableParticipant = initializedParticipantsSnapshot.docs[0];
    const participantRef = doc(db, 'Tournaments', tournamentId, 'participants', firstAvailableParticipant.id);

    await updateDoc(participantRef, {
      user: auth.currentUser.uid,
      team: teamData.name,
      isBye: false,
      eliminated: false,
    });
  };

  const TournamentTeams = ({ tournamentId }) => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const teamsRef = collection(db, 'Tournaments', tournamentId, 'teams');

      const unsubscribeTeams = onSnapshot(
        teamsRef,
        (querySnapshot) => {
          const teamsList = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((team) => team.status !== 'approved' && team.status !== 'rejected');
          setTeams(teamsList);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching teams:', error);
          setLoading(false);
        }
      );

      return () => unsubscribeTeams();
    }, [tournamentId]);

    return (
      <View>
        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          teams.map((team) => (
            <View key={team.id} style={styles.teamContainer}>
              <Text style={styles.teamText}>Team: {team.name}</Text>
              <Text style={styles.teamText}>Status: {team.status}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  title="Approve"
                  onPress={() => updateTeamStatus(tournamentId, team.id, 'approved', setTeams)}
                  disabled={team.status === 'approved'}
                />
                <Button
                  title="Reject"
                  onPress={() => updateTeamStatus(tournamentId, team.id, 'rejected', setTeams)}
                  disabled={team.status === 'rejected'}
                />
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : isAdmin ? (
        tournaments.map((tournament) => (
          <View key={tournament.id} style={styles.tournamentContainer}>
            <Text style={styles.tournamentName}>{tournament.name}</Text>
            <TournamentTeams tournamentId={tournament.id} />
          </View>
        ))
      ) : (
        <Text style={styles.accessDeniedText}>You have not created any tournament</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginTop: 90,
  },
  tournamentContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  teamContainer: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#e9e9e9',
    borderRadius: 4,
  },
  teamText: {
    fontSize: 14,
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  accessDeniedText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'black',
  },
});

export default AdminPage;