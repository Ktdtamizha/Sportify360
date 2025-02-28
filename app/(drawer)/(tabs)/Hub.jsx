import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase.jsx";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TournamentDetails({ navigation }) {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(collection(db, "Tournaments"), where("adminId", "==", userId));

    // 🔹 Real-time listener for tournaments
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tournamentList = [];
      querySnapshot.forEach((doc) => {
        tournamentList.push({ id: doc.id, ...doc.data() });
      });

      setTournaments(tournamentList);
      setLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const updateTeamStatus = async (tournamentId, teamIndex, status) => {
    const tournament = tournaments.find((t) => t.id === tournamentId);
    if (!tournament || !tournament.participants) return;
  
    const selectedTeam = tournament.participants[teamIndex];
  
    // Remove selected team from participants if rejected
    let updatedParticipants = tournament.participants.filter((_, index) => index !== teamIndex);
  
    // If approved, add to acceptedTeams
    let updatedAcceptedTeams = [...(tournament.acceptedTeams || [])];
    if (status === "approved") {
      updatedAcceptedTeams.push({ ...selectedTeam, status: "approved" });
    }
  
    try {
      await updateDoc(doc(db, "Tournaments", tournamentId), {
        participants: updatedParticipants,
        acceptedTeams: updatedAcceptedTeams,
      });
  
      // Update UI immediately after database update
      setTournaments((prevTournaments) =>
        prevTournaments.map((t) =>
          t.id === tournamentId ? { ...t, participants: updatedParticipants, acceptedTeams: updatedAcceptedTeams } : t
        )
      );
    } catch (error) {
      console.error("Error updating team status:", error);
      Alert.alert("Error", "Failed to update team status");
    }
  };
    
  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : tournaments.length > 0 ? (
        <FlatList
          data={tournaments}
          keyExtractor={(item) => item.id}
          renderItem={({ item: tournament }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{tournament.name}</Text>
              <Text style={styles.info}>🏆 Sport: {tournament.sport}</Text>
              <Text style={styles.info}>📍 Location: {tournament.location}</Text>

              <Text style={styles.subTitle}>Pending Teams</Text>
              <FlatList
                data={tournament.participants || []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.teamCard}>
                    <Text style={styles.teamName}>{item.teamName}</Text>
                    <Text style={styles.teamStatus}>Status: {item.status}</Text>

                    {tournament.adminId === auth.currentUser?.uid && item.status === "pending" && (
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={[styles.button, { backgroundColor: "green" }]}
                          onPress={() => updateTeamStatus(tournament.id, index, "approved")}
                        >
                          <Text style={styles.buttonText}>Approve</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.button, { backgroundColor: "red" }]}
                          onPress={() => updateTeamStatus(tournament.id, index, "rejected")}
                        >
                          <Text style={styles.buttonText}>Reject</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              />

              <Text style={styles.subTitle}>Accepted Teams</Text>
              <FlatList
                data={tournament.acceptedTeams || []}
                keyExtractor={(item, index) => `accepted-${index}`}
                renderItem={({ item }) => (
                  <View style={styles.teamCard}>
                    <Text style={styles.teamName}>{item.teamName}</Text>
                    <Text style={styles.teamStatus}>Status: Approved</Text>
                  </View>
                )}
              />
            </View>
          )}
        />
      ) : (
        <Text style={styles.noTournament}>No tournaments available.</Text>
      )}
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop:50
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    alignItems: "center",
    width:'350'
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    color: "#555",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  teamCard: {
    padding: 15,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 3,
    alignItems: "center",
  },
  teamName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  teamStatus: {
    fontSize: 16,
    color: "#777",
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  noTournament: {
    fontSize: 18,
    color: "#888",
  },
});
