// AnimatedLoader.js
import React, {useRef, useEffect, useState} from 'react';
import {View, Animated, Easing, Text, StyleSheet, Dimensions} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const AnimatedLoader = () => {
  const rotation = useRef(new Animated.Value(0)).current;
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(prevCountdown => prevCountdown - 1);
      } else {
        clearInterval(countdownInterval);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [countdown]);

  const animateLoader = () => {
    Animated.timing(rotation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      rotation.setValue(0);
      animateLoader();
    });
  };

  useEffect(() => {
    animateLoader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={{justifyContent: 'center',
    alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 20}}>
      <Animated.View style={[styles.loader, {transform: [{rotate: spin}]}]} />
      <View style={styles.textContainer}>
        <Text style={styles.timerText}>{countdown}</Text>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: -SCREEN_HEIGHT,
    backgroundColor:  'rgba(255, 255, 255, 0.5)',  
    zIndex: 999,
  },

  loader: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    borderTopColor: '#FBDD24',
    borderRightColor: '#FBDD24',
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    zIndex: 9999,
  },
  textContainer: {
    borderColor: 'white',
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold'
  },
});

export default AnimatedLoader;
