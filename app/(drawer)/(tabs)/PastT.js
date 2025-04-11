import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../utils/firebase.js';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { TabView, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { key: 'Cricket', title: 'Cricket' },
  { key: 'Volleyball', title: 'Volleyball' },
  { key: 'Football', title: 'Football' },
];

export default function ViewTournamentsScreen() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Tournaments'));
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
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const renderScene = ({ route }) => {
    const liveTournaments = tournaments.filter((t) => t.status === 'Past' && t.sport === route.key);

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="green" />
        </View>
      );
    }

    return (
      <FlatList
        data={liveTournaments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('TournamentMatches', { tournamentId: item.id })}
          >
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Text style={styles.tournamentName}>{item.name || 'No Name'}</Text>
                <View style={styles.infoRow}>
                  <MaterialIcons name="place" size={18} color="gray" />
                  <Text style={styles.location}>{item.location || 'Unknown'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesome5 name="calendar" size={16} color="gray" />
                  <Text style={styles.details}>
                    {item.startDate ? item.startDate.toDateString() : 'N/A'} -{' '}
                    {item.endDate ? item.endDate.toDateString() : 'N/A'}
                  </Text>
                </View>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badge}>🏆 ₹{item.prize || '0'}</Text>
                  <Text style={styles.badge}>👥 {item.maxTeams || 'N/A'} Teams</Text>
                </View>
              </View>
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
    width: 360,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#343a40',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  location: {
    color: 'gray',
    fontSize: 14,
    marginLeft: 5,
  },
  details: {
    color: 'gray',
    fontSize: 14,
    marginLeft: 5,
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  badge: {
    backgroundColor: '#e9ecef',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: '#495057',
    fontSize: 12,
    fontWeight: 'bold',
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
    color: 'gray',
  },
});