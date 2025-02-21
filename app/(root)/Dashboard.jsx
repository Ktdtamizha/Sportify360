import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import img from '../assets/images/jt.jpg';

export default function Dashboard() {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsPressed(!isPressed)}>
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: isPressed ? 6 : 1 }} // Grows when pressed
          transition={{ type: 'spring', damping: 20 }} // Smooth bounce
          style={styles.imageContainer}
        >
          <Image
            source={img}
            style={styles.image}
          />
        </MotiView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fbef',
  },
  imageContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});
