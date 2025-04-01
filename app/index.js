import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

const logo = require('../assets/images/sportify-logo.png');
const img = require('../assets/images/tennis-ball.png');

export default function Index() {
  const logoScale = useSharedValue(1);
  const textOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(50);

  const logoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: buttonTranslateY.value }],
    };
  });

  React.useEffect(() => {
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800, easing: Easing.ease }),
        withTiming(1, { duration: 800, easing: Easing.ease })
      ),
      -1, 
      true 
    );

    textOpacity.value = withTiming(1, { duration: 1000 });

    buttonTranslateY.value = withSpring(0, {
      damping: 10,
      stiffness: 100,
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 justify-center items-center bg-black">
        <Animated.View className="relative items-center mb-6" style={logoStyle}>
          <Image
            source={logo}
            style={{ width: 300, height: 300 }}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.Text
          style={[
            {
              fontFamily: 'RubikGlitch',
              fontSize: 50,
              width: 300,
              lineHeight: 80,
              textAlign: 'center',
              color: '#8bc34a',
              textShadowRadius: 50,
              marginLeft: 20,
            },
            textStyle,
          ]}
        >
          <Text style={{ fontSize: 70 }} className="text-white">
            S
          </Text>
          P
          <Image style={{ width: 38, height: 34 }} source={img} />
          RTIFY
        </Animated.Text>

        <Animated.View className="mt-8 flex items-center" style={buttonStyle}>
          <LinearGradient
            colors={['#000000', '#4F4F4F']}
            start={[0, 0]}
            end={[1, 0]}
            style={{
              borderRadius: 30,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/LiveT')}
              className="px-6 py-3"
            >
              <Text
                className="tracking-widest"
                style={{
                  fontFamily: 'RubikGlitch',
                  fontSize: 25,
                  color: '#8bc34a',
                }}
              >
                <Text className="text-white">E</Text>XPLOR
                <Text className="text-white">E</Text>
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 30,
    paddingVertical: 22,
    borderWidth: 2,
    borderColor: '#A4DE02',
    borderRadius: 30,
  },
  exploreButton: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
  },
});