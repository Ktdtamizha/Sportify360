import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { Alert } from 'react-native';

export const checkRoundCompletion = async (tournamentId, round) => {
  try {
    const matchesRef = collection(db, 'Tournaments', tournamentId, 'matches');
    const q = query(matchesRef, where('round', '==', round));
    const snapshot = await getDocs(q);
    return snapshot.docs.every(doc => doc.data().status === 'completed');
  } catch (error) {
    console.error('Error checking round completion:', error);
    return false;
  }
};

export const sendTournamentEndNotification = async (winningTeam) => {
  try {
    const tokensSnap = await getDocs(collection(db, 'PushTokens'));
    const messages = [];

    tokensSnap.forEach(doc => {
      const token = doc.data().token;
      if (token) {
        messages.push({
          to: token,
          sound: 'default',
          title: '🏆 Tournament Completed!',
          body: `Congratulations! ${winningTeam} has won the tournament.`,
        });
      }
    });

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const data = await response.json();
    console.log('Notification response:', data);
  } catch (error) {
    console.error('Failed to send push notifications:', error);
  }
};

export const saveMatchResult = async ({ tournamentId, match, matchId, winner }) => {
  if (!winner || !match) {
    Alert.alert('Error', 'Winner or match data missing.');
    return;
  }

  try {
    const matchRef = doc(db, 'Tournaments', tournamentId, 'matches', matchId);
    await updateDoc(matchRef, {
      status: 'completed',
      winner: winner
    });

    // Advance winner to next match
    if (match.nextMatch) {
      const nextMatchRef = doc(db, 'Tournaments', tournamentId, 'matches', match.nextMatch);
      const nextMatchSnap = await getDoc(nextMatchRef);

      if (nextMatchSnap.exists()) {
        const nextMatchData = nextMatchSnap.data();

        if (!nextMatchData.team1) {
          await updateDoc(nextMatchRef, { team1: winner });
        } else if (!nextMatchData.team2) {
          await updateDoc(nextMatchRef, { team2: winner });
        }
      } else {
        console.error('Next match not found');
      }
    }

    // Check round completion
    if (await checkRoundCompletion(tournamentId, match.round)) {
      await updateDoc(doc(db, 'Tournaments', tournamentId), {
        currentRound: match.round + 1,
      });

      // Check if all matches are completed
      const matchesSnapshot = await getDocs(collection(db, 'Tournaments', tournamentId, 'matches'));
      const allMatches = matchesSnapshot.docs.map(doc => doc.data());
      const allCompleted = allMatches.every(m => m.status === 'completed');

      if (allCompleted) {
        await updateDoc(doc(db, 'Tournaments', tournamentId), {
          status: 'completed',
          winner: winner
        });

        await sendTournamentEndNotification(winner);
        Alert.alert('Tournament Completed!', `${winner} has won the tournament!`);
      } else {
        Alert.alert('Round Complete', `All matches in round ${match.round} are finished!`);
      }
    }

    Alert.alert('Success', 'Match result saved successfully!');
    return true;
  } catch (error) {
    console.error('Save failed:', error);
    Alert.alert('Error', `Failed to save result: ${error.message}`);
    return false;
  }
};
