import { FlatList, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react';
import matches from '../../matches.js';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
const categories = ['All', 'Cricket', 'Volleyball', 'Football']; 

const Up = () => {
  const [selectedCategory, setSelectedCategory] = useState('All'); 

  const filteredMatches = selectedCategory === 'All' 
    ? matches.filter((item) => item.type === 'Up') 
    : matches.filter((item) => item.type === 'Up' && item.category === selectedCategory);

  return (
    <LinearGradient colors={['#f0fbef','#c0efbb']} style={{flex:1}}>
    <SafeAreaView style={styles.container}>
      
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <Pressable
            key={category} 
            style={[
              styles.categoryButton, 
              selectedCategory === category && styles.selectedCategory 
            ]}
            onPress={() => setSelectedCategory(category)} 
          >
                        <Text style={[
                          styles.categoryText,
                          selectedCategory === category && styles.selectedCategoryText
                        ]}>{category}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredMatches}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <ImageBackground source={item.image} style={styles.card} imageStyle={styles.image}>
              <View style={styles.overlay}>
                <Text style={styles.text}>{item.name}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
    </LinearGradient>
  );
};

export default Up

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    marginTop:70,
  },
  selectedCategoryText: {
    color:'white',
  },
  categoryButton: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedCategory: {
    backgroundColor: 'green',
  },
  categoryText: {
    color: 'black',
    fontWeight: 'bold',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 30,
    alignItems: 'center',
  },
  card: {
    marginTop: 20,
    width: 350,
    height: 190,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  image: {
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});