import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useRouter } from 'expo-router';


export default function Organize() {

  const router = useRouter();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [lastDate, setLastDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showLastDatePicker, setShowLastDatePicker] = useState(false);

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);  
    setStartDate(currentDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);  
    setEndDate(currentDate);
  };

  const onLastDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || lastDate;
    setShowLastDatePicker(false);  
    setLastDate(currentDate);
  };

  const handleSubmit = () => {
    
    Alert.alert('Tournament Created!');
    router.push('/OrgDashboard');
  };

  return (
<View style={styles.container}>
 <ScrollView>
 <StatusBar backgroundColor='#16b8c9' />
 <Text style={styles.text}>Organize Tournaments</Text>
 <TextInput style={styles.textInput} placeholder="Enter tournament name" placeholderTextColor= "white" />
 
 <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
            <TextInput
              style={styles.textInput}
              placeholder="Start Date"
              value={startDate.toDateString()}
              editable={false}
              placeholderTextColor="white"
            />
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="calendar"
              onChange={onStartDateChange}
            />
          )}

          
<TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
            <TextInput
              style={styles.textInput}
              placeholder="End Date"
              value={endDate.toDateString()}
              editable={false}
              placeholderTextColor="white"
            />
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="calendar"
              onChange={onEndDateChange}
          />
          )}
 <TextInput style={styles.textInput} placeholder="Enter location" placeholderTextColor= "white" />
 <TouchableOpacity onPress={() => setShowLastDatePicker(true)}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter registration deadline"
              value={lastDate.toDateString()}
              editable={false}
              placeholderTextColor="white"
            />
          </TouchableOpacity>
          {showLastDatePicker && (
            <DateTimePicker
              value={lastDate}
              mode="date"
              display="calendar"
              onChange={onLastDateChange}
            />
          )}
 <TextInput style={styles.textInput} keyboardType="numeric" placeholder="Max number of participants" placeholderTextColor= "white" />
 <TextInput style={styles.textInput} keyboardType="numeric" placeholder="Entry fee (if any)" placeholderTextColor= "white" />
 <TextInput style={styles.multiline} placeholder="Enter prize details" multiline={true} placeholderTextColor= "white" />
 <TextInput style={styles.multiline} placeholder="Enter rules" multiline={true} placeholderTextColor= "white" />
 <TextInput style={styles.textInput} placeholder="Mobile Number" placeholderTextColor= "white"/>
 <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.btnLogin}>Submit</Text>
 </TouchableOpacity>
 </ScrollView>
 </View>
  )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor:'black',
      flex: 1,
      padding:40
    },
    text: {
      color: 'white',
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
      marginTop: 20,
    },
    textInput: {
      color: 'white',
      borderColor: 'white',
      borderWidth: 2,
      padding: 10,
      borderRadius: 15,
      marginTop: 20,
      width: '80%',
      alignSelf: 'center',
    },
    btnLogin: {
      backgroundColor: 'black',
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      borderRadius: 15,
      padding: 15,
      width: '60%',
      marginTop: 10,
      marginBottom: 10,
      alignSelf: 'center',
    },
   multiline: {
     textAlignVertical: 'top',
     color: 'white',
     borderColor: 'white',
     borderWidth: 2,
     padding: 10,
     borderRadius: 15,
     marginTop: 20,
     width: '80%',
     alignSelf: 'center',
   },
   
  });