import React, { useState } from 'react';
import { View, Text, TextInput, ImageBackground ,TouchableOpacity, StyleSheet, Alert,  StatusBar, ScrollView, KeyboardAvoidingView, Platform  } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function OrganizeScreen( {navigation} ) { 
  
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
    const currentDate = selectedDate || endDate;
    setShowLastDatePicker(false);  
    setLastDate(currentDate);
  };

  const handleSubmit = () => {
    
    Alert.alert('Tournament Created!',);
    router.push('OrgDashboard');
  };

  return(
  <SafeAreaView style={styles.container}>
  <ScrollView>
  <Text style={styles.hText}>Organize Form</Text>
  <Text style={styles.text}>Tournament Name</Text>
  <TextInput style={styles.iText} placeholder='Enter tournament name' placeholderTextColor='white'/>
  <Text style={styles.text}>Tournament Start Date</Text>
  <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
            <TextInput
              style={styles.iText}
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

<Text style={styles.text}>Tournament End Date</Text>          
<TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
            <TextInput
              style={styles.iText}
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
  <Text style={styles.text}>Tournament Location</Text>
  <TextInput style={styles.iText} placeholder='Enter location' placeholderTextColor='white'/>
  <Text style={styles.text}>Max No. of Participants</Text>
  <TextInput style={styles.iText} placeholder='Enter maximum participants' placeholderTextColor='white' keyboardType= "numeric"/>
  <Text style={styles.text}>Registration Deadline</Text>
  <TouchableOpacity onPress={() => setShowLastDatePicker(true)}>
            <TextInput
              style={styles.iText}
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

  <Text style={styles.text}>Prize Details</Text>
  <TextInput style={styles.multiline} placeholder="Enter prize details" multiline={true} placeholderTextColor='white'/>
  <Text style={styles.text}>Rules</Text>
 <TextInput style={styles.multiline} placeholder="Enter rules" multiline={true} placeholderTextColor='white' />
 <Text style={styles.text}>Contact Information</Text>
  <TextInput style={styles.iText} placeholder='Enter Phone NUmber' placeholderTextColor='white'/>
  <TouchableOpacity onPress={(handleSubmit)}>
        <Text style={styles.btnLogin}>Submit</Text>
 </TouchableOpacity>
  </ScrollView>
  </SafeAreaView>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black",
    },
    hText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      marginTop: 20,
    },
    image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    },
    text: {
      paddingHorizontal: 10,
      color: 'white',
      fontSize: 15,
      marginTop: 10,
    },
    iText: {
      padding: 10,
      borderColor: 'white',
      borderWidth: 2,
      color: 'white',
      fontSize: 15,
      margin: 10,
    },

  btnLogin: {
    backgroundColor: '#65167a',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 15,
    padding: 15,
    width: '60%',
    margin: 10,
    alignSelf: 'center',
  },
 multiline: {
   borderColor: 'white',
   fontSize: 15,
   minHeight: '100',
   textAlignVertical: 'top',
   borderWidth: 2,
   padding: 10,
   margin: 10,
   width: '95%',
   alignSelf: 'center',
 },
  });