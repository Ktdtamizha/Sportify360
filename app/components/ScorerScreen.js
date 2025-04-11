import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { saveMatchResult } from '../../utils/saveMatchResult';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const MAX_OVERS = 2;
const BALLS_PER_OVER = 6;
const MAX_WICKETS = 2;

const ScorerScreen = () => {
  const { tournamentId, matchId } = useLocalSearchParams();
  const [match, setMatch] = useState(null);
  const [currentInning, setCurrentInning] = useState(1);
  const [target, setTarget] = useState(null);
  const [winner, setWinner] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showNoBallPrompt, setShowNoBallPrompt] = useState(false);
  const [noBallRuns, setNoBallRuns] = useState('');

  const [scores, setScores] = useState({
    team1: { runs: 0, wickets: 0, balls: 0 },
    team2: { runs: 0, wickets: 0, balls: 0 },
  });

  useEffect(() => {
    const fetchMatch = async () => {
      const matchRef = doc(db, 'Tournaments', tournamentId, 'matches', matchId);
      const snap = await getDoc(matchRef);
      if (snap.exists()) setMatch({ id: snap.id, ...snap.data() });
    };
    fetchMatch();
  }, []);

  const displayOvers = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`;
  const teamKey = currentInning === 1 ? 'team1' : 'team2';
  const battingTeam = match?.[teamKey];
  const { runs, wickets, balls } = scores[teamKey];

  const updateScore = (type, value, countBall = true) => {
    if (winner) return;

    setScores(prev => {
      const team = prev[teamKey];
      return {
        ...prev,
        [teamKey]: {
          runs: type === 'runs' ? team.runs + value : team.runs,
          wickets: type === 'wickets' ? team.wickets + value : team.wickets,
          balls: countBall ? team.balls + 1 : team.balls,
        }
      };
    });
  };

  const addRun = (value) => updateScore('runs', value);
  const addWicket = () => updateScore('wickets', 1);
  const addWide = () => updateScore('runs', 1, false);
  const addBall = () => updateScore(null, 0);
  const addNoBall = (runsScored) => updateScore('runs', runsScored + 1, false);

  useEffect(() => {
    const checkInningStatus = () => {
      const { runs, wickets, balls } = scores[teamKey];
      const overs = Math.floor(balls / BALLS_PER_OVER);

      if (currentInning === 1 && (overs >= MAX_OVERS || wickets >= MAX_WICKETS)) {
        setTarget(runs + 1);
        setCurrentInning(2);
      }

      if (currentInning === 2) {
        const chasing = scores.team2.runs;
        const overs2 = Math.floor(scores.team2.balls / BALLS_PER_OVER);

        if (chasing >= target) {
          setWinner(match.team2);
        } else if (overs2 >= MAX_OVERS || scores.team2.wickets >= MAX_WICKETS) {
          const team1Score = scores.team1.runs;
          if (chasing > team1Score) setWinner(match.team2);
          else if (chasing < team1Score) setWinner(match.team1);
          else setWinner('Draw');
        }
      }
    };

    if (match) checkInningStatus();
  }, [scores]);

  const handleSave = async () => {
    if (!winner || !match) {
      Alert.alert('Error', 'Match is not complete.');
      return;
    }
    setUpdating(true);
    const success = await saveMatchResult({ tournamentId, match, matchId, winner });
    setUpdating(false);
    if (success) router.back();
  };

  if (!match) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f4f6f8' }}>
      <Text style={{ fontSize: 20, marginTop: 30, fontWeight: 'bold', textAlign: 'center' }}>
        {winner ? `🏆 Winner: ${winner}` : `Scoring: ${battingTeam} (Inning ${currentInning})`}
      </Text>

      {target && !winner && (
        <Text style={{ fontSize: 18, marginVertical: 12, textAlign: 'center' }}>
          🎯 Target: {target} ({target - scores.team2.runs} runs needed)
        </Text>
      )}

      {!winner && (
        <>
          <View style={{ marginVertical: 15, padding: 10, backgroundColor: '#fff', borderRadius: 10, shadowColor: '#ccc', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
            <Text style={{ fontSize: 18 }}>Runs: {runs}</Text>
            <Text style={{ fontSize: 18 }}>Wickets: {wickets}/{MAX_WICKETS}</Text>
            <Text style={{ fontSize: 18 }}>Overs: {displayOvers(balls)} / {MAX_OVERS}</Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <TouchableOpacity key={num} onPress={() => addRun(num)} style={styles.btn}>
                <Text style={styles.btnText}>+{num} Run</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={addWicket} style={[styles.btn, { backgroundColor: '#e74c3c' }]}>
              <Text style={styles.btnText}>+ Wicket</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addWide} style={[styles.btn, { backgroundColor: '#f39c12' }]}>
              <Text style={styles.btnText}>+ Wide</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowNoBallPrompt(true)} style={[styles.btn, { backgroundColor: '#8e44ad' }]}>
              <Text style={styles.btnText}>+ No Ball</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addBall} style={[styles.btn, { backgroundColor: '#34495e' }]}>
              <Text style={styles.btnText}>+ Dot Ball</Text>
            </TouchableOpacity>
          </View>

          {showNoBallPrompt && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>Runs scored on No Ball:</Text>
              <TextInput
                keyboardType="numeric"
                value={noBallRuns}
                onChangeText={setNoBallRuns}
                placeholder="Enter runs"
                style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ccc' }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                <TouchableOpacity onPress={() => {
                  const parsed = parseInt(noBallRuns);
                  if (!isNaN(parsed)) addNoBall(parsed);
                  setNoBallRuns('');
                  setShowNoBallPrompt(false);
                }} style={[styles.btn, { width: '45%' }]}>
                  <Text style={styles.btnText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowNoBallPrompt(false)} style={[styles.btn, { width: '45%', backgroundColor: '#aaa' }]}>
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}

      {winner && (
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.btn, { backgroundColor: '#27ae60', marginTop: 30 }]}
          disabled={updating}
        >
          {updating ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Save Result</Text>}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = {
  btn: {
    width: '30%',
    backgroundColor: '#2980b9',
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
};

export default ScorerScreen;