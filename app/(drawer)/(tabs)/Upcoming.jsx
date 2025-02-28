import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { collection, onSnapshot, doc, updateDoc, arrayUnion, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { TabView, TabBar } from 'react-native-tab-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const categories = [
  { key: 'Cricket', title: 'Cricket' },
  { key: 'Volleyball', title: 'Volleyball' },
  { key: 'Football', title: 'Football' },
];

export default function ViewTournamentsScreen() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [playersCount, setPlayersCount] = useState('');
  const [user, setUser] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [joinedTournaments, setJoinedTournaments] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchJoinedTournaments = async () => {
      if (!user) return;
      const storedTournaments = JSON.parse(await AsyncStorage.getItem(`joinedTournaments_${user.uid}`)) || [];
      setJoinedTournaments(storedTournaments);
    };
    fetchJoinedTournaments();
  }, [user]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'Tournaments'), (querySnapshot) => {
      const today = new Date();
      const tournamentsList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const startDate = data.startDate ? data.startDate.toDate() : null;
        const endDate = data.endDate ? data.endDate.toDate() : null;
        let status = 'Upcoming';
        if (startDate && endDate) {
          if (startDate > today) {
            status = 'Upcoming';
          } else if (startDate <= today && endDate >= today) {
            status = 'Live';
          } else if (endDate < today) {
            status = 'Past';
          }
        }
        return { id: doc.id, ...data, startDate, endDate, status };
      });
      setTournaments(tournamentsList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openJoinModal = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setHasJoined(joinedTournaments.includes(tournamentId));
    setModalVisible(true);
  };

  const handleJoinTournament = async () => {
    if (!user) {
      Alert.alert('Login Required', 'You need to log in first to join a tournament.');
      return;
    }
    if (!teamName || !playersCount) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }
    const tournamentRef = doc(db, 'Tournaments', selectedTournamentId);
    const tournamentSnapshot = await getDoc(tournamentRef);
    if (tournamentSnapshot.exists()) {
      const tournamentData = tournamentSnapshot.data();
      const existingParticipants = tournamentData.participants || [];
      const maxParticipants = tournamentData.maxTeams || 0;
      if (existingParticipants.length >= maxParticipants) {
        Alert.alert('Error', 'Tournament is full. No more teams can join.');
        return;
      }
      const storedTournaments = JSON.parse(await AsyncStorage.getItem(`joinedTournaments_${user.uid}`)) || [];
      if (storedTournaments.includes(selectedTournamentId)) {
        Alert.alert('Error', 'Your team has already joined this tournament.');
        return;
      }
      const alreadyJoined = existingParticipants.some((participant) => participant.teamName === teamName);
      if (alreadyJoined) {
        Alert.alert('Error', 'This team has already joined the tournament.');
        return;
      }
      const teamData = {
        teamId: `team_${Date.now()}`,
        teamName: teamName,
        playersCount: parseInt(playersCount),
        joinedAt: Timestamp.now(),
        userId: user.uid,
        status: 'pending',
      };
      await updateDoc(tournamentRef, {
        participants: arrayUnion(teamData),
      });
      const updatedJoinedTournaments = [...storedTournaments, selectedTournamentId];
      setJoinedTournaments(updatedJoinedTournaments);
      await AsyncStorage.setItem(`joinedTournaments_${user.uid}`, JSON.stringify(updatedJoinedTournaments));
      setHasJoined(true);
      Alert.alert('Success', 'Your team has successfully joined the tournament!');
      setModalVisible(false);
      setTeamName('');
      setPlayersCount('');
    } else {
      Alert.alert('Error', 'Tournament not found.');
    }
  };

  const renderScene = ({ route }) => {
    const liveTournaments = tournaments.filter((t) => t.status === 'Upcoming' && t.sport === route.key);
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      );
    }
    return (
      <FlatList
        data={liveTournaments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <LinearGradient colors={['#ffffff', '#f0f0f0']} style={styles.card}>
              <Text style={styles.tournamentName}>{item.name || 'No Name'}</Text>
              <View style={styles.infoRow}>
                <MaterialIcons name="place" size={18} color="#666" />
                <Text style={styles.location}>{item.location || 'Unknown'}</Text>
              </View>
              <View style={styles.infoRow}>
                <FontAwesome5 name="calendar" size={16} color="#666" />
                <Text style={styles.details}>
                  {item.startDate ? item.startDate.toDateString() : 'N/A'} - {item.endDate ? item.endDate.toDateString() : 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <FontAwesome5 name="users" size={16} color="#666" />
                <Text style={styles.details}>{item.maxTeams || 'N/A'} Teams</Text>
              </View>
              <View style={styles.badgeContainer}>
                <Text style={styles.badge}>🏆 ₹{item.prize || '0'}</Text>
                <TouchableOpacity
                  style={[styles.joinButton, (!user || joinedTournaments.includes(item.id)) && styles.disabledButton]}
                  onPress={() => {
                    if (!user) {
                      Alert.alert('Login Required', 'Please log in to join a tournament.');
                      return;
                    }
                    openJoinModal(item.id);
                  }}
                  disabled={!user || joinedTournaments.includes(item.id)}
                >
                  <Text style={styles.joinButtonText}>
                    {!user ? 'Login to Join' : joinedTournaments.includes(item.id) ? 'Joined ✅' : 'Join Tournament'}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>No live tournaments found for {route.title}.</Text>
          </View>
        )}
      />
    );
  };

  const layout = Dimensions.get('window').width;
  const [routes] = useState(categories);

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              renderLabel={({ route }) => (
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{route.title}</Text>
              )}
              indicatorStyle={styles.tabBarIndicator}
              style={styles.tabBar}
            />
          )}
        />
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Team Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Team Name"
                value={teamName}
                onChangeText={setTeamName}
              />
              <TextInput
                style={styles.input}
                placeholder="Number of Players"
                value={playersCount}
                onChangeText={setPlayersCount}
                keyboardType="numeric"
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.joinConfirmButton} onPress={handleJoinTournament}>
                  <Text style={styles.joinButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
  },
  listContainer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    marginVertical: 10,
    width: Dimensions.get('window').width * 0.9,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tournamentName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    color: '#666',
    fontSize: 14,
    marginLeft: 5,
  },
  details: {
    color: '#666',
    fontSize: 14,
    marginLeft: 5,
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  badge: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  tabBar: {
    backgroundColor: 'green',
    elevation: 5,
    height: 50,
  },
  tabBarIndicator: {
    backgroundColor: 'white',
    height: 3,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  joinConfirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
});