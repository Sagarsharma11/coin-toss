import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, StyleSheet, Linking } from 'react-native';
import * as Haptics from 'expo-haptics'; // Import expo-haptics

export default function App() {
  const [result, setResult] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false); // State to track if the coin is flipping
  const flipAnimation = useRef(new Animated.Value(0)).current;

  // Updated image paths
  const coinImages = {
    head: require('./assets/head.png'), 
    tail: require('./assets/tail.png')  
  };

  const startFlipAnimation = () => {
    setResult(null); // Reset result on each flip
    setIsFlipping(true); // Disable button by setting isFlipping to true

    // Trigger haptic feedback when starting the flip
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Reset animation value
    flipAnimation.setValue(0);

    // Create a looping animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(flipAnimation, {
          toValue: 1,
          duration: 200, // Shorter duration for a faster flip
          useNativeDriver: true,
        }),
        Animated.timing(flipAnimation, {
          toValue: 0,
          duration: 200, // Shorter duration for a faster flip
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: 5, // Increase iterations for more flips
      }
    ).start(() => {
      // After the loop ends, decide the result
      const randomResult = Math.random() < 0.5 ? 'head' : 'tail';
      setResult(randomResult);
      setIsFlipping(false); // Enable button by setting isFlipping to false
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    });
  };

  const flipInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const animatedStyle = {
    transform: [{ rotateY: flipInterpolate }]
  };

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={result ? coinImages[result] : coinImages.head} 
        style={[styles.coin, animatedStyle]} 
      />
      <TouchableOpacity
        onPress={startFlipAnimation}
        style={[styles.button, isFlipping && styles.disabledButton]}
        disabled={isFlipping} // Disable the button while flipping
      >
        <Text style={styles.buttonText}>Flip Coin</Text>
      </TouchableOpacity>
      <Text style={styles.resultText}>
        {isFlipping ? "Wait ..." : result ? result.toUpperCase() : ""}
      </Text>
      <Text style={styles.creditText} onPress={() => Linking.openURL('https://sagarsharma.vercel.app')}>
        Made by Sagar
      </Text>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212'  
  },
  coin: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'orangered',  
    padding: 10,
    borderRadius: 5
  },
  disabledButton: {
    backgroundColor: '#555',  
  },
  buttonText: {
    color: '#FFFFFF',  
    fontSize: 18
  },
  resultText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF' 
  },
  creditText: {
    marginTop: 20,
    fontSize: 14,
    color: '#BB86FC',  
    textDecorationLine: 'underline',  
    textAlign: 'center'
  }
});
