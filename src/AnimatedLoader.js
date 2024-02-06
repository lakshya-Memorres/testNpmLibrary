import React, {useRef, useEffect, useState, useMemo} from 'react';
import {View, Animated, Easing, Text} from 'react-native';
import createStyles from './styles'

const AnimatedLoader = ({primaryColor}) => {

  const styles = useMemo(() => createStyles(primaryColor), [
    primaryColor,
  ]);
  
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
    <View style={styles.animatedLoaderContainer}>
      <View style={styles.innerLoaderContainer}>
      <Animated.View style={[styles.loader, {transform: [{rotate: spin}]}]} />
      <View style={styles.textContainer}>
        <Text style={styles.timerText}>{countdown}</Text>
      </View>
      </View>
    </View>
  );
};

export default AnimatedLoader;
