import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { collection, onSnapshot, doc, updateDoc, getDoc, query, getDocs, where } from 'firebase/firestore';
import { auth, db } from '../../../utils/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { TabView, TabBar } from 'react-native-tab-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { router } from 'expo-router';
import axios from "axios";

const API_URL = "http://10.16.52.209:5000";



import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';

const categories = [
  { key: 'Cricket', title: 'Cricket' },
  { key: 'Volleyball', title: 'Volleyball' },
  { key: 'Football', title: 'Football' },
];

export default function ViewTournamentsScreen() {
  const [tournaments, setTournaments] = useState([]);
  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [user, setUser] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [joinedTournaments, setJoinedTournaments] = useState([]);

  const [teamName, setTeamName] = useState('');
  const [mobileNum, setmobileNum] = useState('');
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(true);


  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const modalOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.8);


  useEffect(() => {
    if (modalVisible) {
      modalOpacity.value = withTiming(1, { duration: 300, easing: Easing.ease });
      modalScale.value = withTiming(1, { duration: 300, easing: Easing.ease });
    } else {
      modalOpacity.value = withTiming(0, { duration: 200, easing: Easing.ease });
      modalScale.value = withTiming(0.8, { duration: 200, easing: Easing.ease });
    }
  }, [modalVisible]);

  const closeModal = () => {
    setModalVisible(false);
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  useEffect(() => {
    if (loading) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 500, easing: Easing.ease }),
          withTiming(1, { duration: 500, easing: Easing.ease })
        ),
        -1, 
        true 
      );

      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1 
      );
    } else {
      scale.value = withTiming(1, { duration: 300 });
      rotation.value = withTiming(0, { duration: 300 });
    }
  }, [loading]);

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

  const assignTeamToMatch = async (matchRef, teamName, userId) => {
    try {
      const matchDoc = await getDoc(matchRef);
      const matchData = matchDoc.data();
  
      if (matchData.team1 === null) {
        await updateDoc(matchRef, {
          team1: teamName,
          player1: userId,
        });
      } else if (matchData.team2 === null) {
        await updateDoc(matchRef, {
          team2: teamName,
          player2: userId,
        });
      } else {
        Alert.alert('Error', 'No available slots in this match.');
      }
    } catch (error) {
      console.error('Error assigning team:', error);
      Alert.alert('Error', 'Failed to join match.');
    }
  };


  const handleJoinTournament = async (tournamentId, teamName) => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to join a tournament.');
      return;
    }
  
    try {
      const tournamentRef = doc(db, 'Tournaments', tournamentId);
      const tournamentDoc = await getDoc(tournamentRef);
  
      if (!tournamentDoc.exists()) {
        Alert.alert('Error', 'Tournament not found.');
        return;
      }
  
      const tournamentData = tournamentDoc.data();
  
      if (tournamentData.participantsCount >= tournamentData.maxParticipants) {
        Alert.alert('Error', 'Tournament is full. You cannot join.');
        return;
      }
  
      const participantsRef = collection(db, 'Tournaments', tournamentId, 'participants');
      const participantQuery = query(participantsRef, where('user', '==', auth.currentUser.uid));
      const participantSnapshot = await getDocs(participantQuery);
  
      const hasAlreadyJoined = !participantSnapshot.empty;
  
      if (hasAlreadyJoined) {
        Alert.alert('Info', 'You have already joined this tournament.');
        return;
      }
  
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
        team: teamName,
        isBye: false,
        eliminated: false,
      });
  
      await updateDoc(tournamentRef, {
        participantsCount: tournamentData.participantsCount + 1,
      });
  
      // Update local storage
      const updatedJoinedTournaments = [...joinedTournaments, tournamentId];
      setJoinedTournaments(updatedJoinedTournaments);
      await AsyncStorage.setItem(
        `joinedTournaments_${auth.currentUser.uid}`,
        JSON.stringify(updatedJoinedTournaments)
      );
  
      const matchesRef = collection(db, 'Tournaments', tournamentId, 'matches');
      const matchesQuery = query(matchesRef, where('round', '==', 1));
      const matchesSnapshot = await getDocs(matchesQuery);
  
      let assigned = false;
      for (const matchDoc of matchesSnapshot.docs) {
        const matchData = matchDoc.data();
        const matchRef = doc(db, 'Tournaments', tournamentId, 'matches', matchDoc.id);
  
        if (matchData.team1 === null || matchData.team1 === '') {
          await assignTeamToMatch(matchRef, teamName, auth.currentUser.uid);
          assigned = true;
          break;
        } else if (matchData.team2 === null || matchData.team2 === '') {
          await assignTeamToMatch(matchRef, teamName, auth.currentUser.uid);
          assigned = true;
          break;
        }
      }
  
      if (!assigned) {
        Alert.alert('Error', 'No available matches to join.');
        return;
      }
  
      // ✅ Send Push Notification to Tournament Organizer
      if (tournamentData.adminId) {
        const organizerDoc = await getDoc(doc(db, 'users', tournamentData.adminId));
        if (organizerDoc.exists()) {
          const organizerData = organizerDoc.data();
          const pushToken = organizerData.expoPushToken;
  
          if (pushToken) {
            await fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to: pushToken,
                sound: 'default',
                title: '🎯 New Player Joined!',
                body: `A player just joined your tournament "${tournamentData.name}".`,
                data: { screen: 'TournamentDetails', tournamentId: tournamentId },
              }),
            });
          }
        }
      }
    } catch (error) {
      console.error('Error joining tournament:', error);
      Alert.alert('Error', 'Failed to join the tournament.');
    }
  };
  


  
  const sendOtp = async () => {
    if (!mobileNum) {
      Alert.alert("Error", "Please enter a valid mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/send-otp`, { phone: mobileNum });
      if (response.data.success) {
        setOtpSent(true);
        Alert.alert("OTP Sent", "Please check your phone for the OTP.");
      } else {
        Alert.alert("Error", response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while sending OTP.");
    } finally {
      setLoading(false);
    }
  };


  const verifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/verify-otp`, { phone: mobileNum, otp });
      if (response.data.success) {
        Alert.alert("Success", "OTP verified! You can now join the tournament.");
        handleJoinTournament(selectedTournamentId, teamName);
        closeModal();
      } else {
        Alert.alert("Error", "Invalid OTP. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const renderScene = ({ route }) => {
    const liveTournaments = tournaments.filter((t) => t.status === 'Upcoming' && t.sport === route.key);
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.indicatorContainer, animatedIndicatorStyle]}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </Animated.View>
        </View>
      );
    }
    return (
      <FlatList
        data={liveTournaments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/TournamentMatchesScreen?tournamentId=${item.id}`)}>
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
                <Text style={styles.details}>{item.maxParticipants || 'N/A'} Teams</Text>
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
          </TouchableOpacity>
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
            <Modal visible={modalVisible} transparent animationType="none">
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent]}>
          <Text style={styles.modalTitle}>Enter Team Details</Text>

          <TextInput
            style={styles.input}
            placeholder="Team Name"
            value={teamName}
            onChangeText={setTeamName}
          />

          {!otpSent ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                value={mobileNum}
                onChangeText={setmobileNum}
              />
              <TouchableOpacity style={styles.joinConfirmButton} onPress={sendOtp} disabled={loading}>
                <Text style={styles.joinButtonText}>{loading ? "Sending OTP..." : "Send OTP"}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.joinConfirmButton} onPress={verifyOtp} disabled={loading}>
                <Text style={styles.joinButtonText}>{loading ? "Verifying OTP..." : "Verify OTP"}</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.joinConfirmButton}
              onPress={() => otpSent && verifyOtp()}
              disabled={loading || !otpSent}
            >
              <Text style={styles.joinButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: 300,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  joinConfirmButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  joinButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});