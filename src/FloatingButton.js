import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Image,
  NativeEventEmitter,
  NativeModules,
  Dimensions,
  Text,
  Modal,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import {icon} from './utils';
import {Platform} from 'react-native';
// import {useMyContext} from './context/MyContext';
import AnimatedLoader from './AnimatedLoader';

const {RecordScreen} = NativeModules;
const recordScreenEvents = new NativeEventEmitter(RecordScreen);

const SCREEN_HEIGHT = Dimensions.get('window').height;

const FloatingButton = ({onPressCamera, useMyContext, primaryColor, secondaryColor}) => {
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
       zIndex: 1,
      bottom: 16,
      right: 16,
    },
    mainButton: {
      backgroundColor: primaryColor,
      borderRadius: 27,
      width: 54,
      height: 54,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      zIndex: 99999,
    },
    screenshotCountBtn: {
      backgroundColor: primaryColor,
      borderRadius: 27,
      width: 54,
      height: 54,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      zIndex: 99999,
      position: 'absolute',
      bottom: 210,
      right: 16,
    },
    subButtonContainer: {
      position: 'absolute',
      bottom: 54,
    },
    subButton: {
      backgroundColor: primaryColor,
      borderRadius: 27,
      width: 54,
      height: 54,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      marginBottom: 10,
    },
    playPauseContainer: {
      position: 'absolute',
      bottom: 10,
      right: 0,
      backgroundColor: primaryColor,
      borderRadius: 27,
    },
    playPauseButton: {
      backgroundColor: primaryColor,
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
    },
    countText: {
      color: secondaryColor,
      fontSize: 20,
    },
    iconStyle: {
      height: 25,
      width: 25,
      tintColor: secondaryColor,
    },
    recIconStyle: {
      height: 22,
      width: 22,
      tintColor: secondaryColor,
    },
    smallIconStyle: {
      height: 20,
      width: 20,
      tintColor: secondaryColor,
    },
    smallIconIosStyle: {
      height: 20,
      width: 20,
    },
    cancelIconStyle: {
      height: 12,
      width: 12,
      tintColor: secondaryColor
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '90%',
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonClose: {
      backgroundColor: primaryColor,
      width: '100%',
    },
    textStyle: {
      color: secondaryColor,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 2,
    },
    modalTextInput: {
      borderWidth: 1,
      width: '100%',
      height: 150,
      borderRadius: 15,
      textAlignVertical: 'top',
      paddingHorizontal: 10,
      fontSize: 16,
      borderWidth: 1,
      borderColor: 'rgba(211, 211, 211, 0.6)',
      marginBottom: 15
    },
    cancelModalBtn: {
      position: 'absolute', 
      height: 30, 
      width: 30, 
      borderRadius: 15, 
      backgroundColor: primaryColor,
      justifyContent: 'center',
      alignItems: 'center',
      top: -13,
      right: -13
  }
  });

  const {startRecording, startRecordingMethod, isPaused, pauseRecordingMethod} =
    useMyContext();
  const [showButtons, setShowButtons] = useState(false);
  const [showMainButton, setShowMainButton] = useState(false);
  const [showRecButtonsIos, setShowRecButtonsIos] = useState(false);
  const [showScreenShotCount, setShowScreenShotCount] = useState(false);
  const [screenshotCount, setScreenshotCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [rotation] = useState(new Animated.Value(0));
  const [translateY1] = useState(new Animated.Value(0));
  const [translateY2] = useState(new Animated.Value(0));

  useEffect(() => {
    if (showButtons) {
      Animated.parallel([
        Animated.timing(translateY1, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(translateY2, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        rotateImage(45),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY1, {
          toValue: 128,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(translateY2, {
          toValue: 64,
          duration: 200,
          useNativeDriver: false,
        }),
        rotateImage(0),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showButtons, startRecording]);

  useEffect(() => {
    const addRecordingEventListener = (eventName, callback) => {
      return recordScreenEvents.addListener(eventName, callback);
    };

    const handleRecordingEvent = eventData => {
      if (eventData === 'true') {
        startRecordingMethod(false);
      } else if (eventData === 'false') {
        startRecordingMethod(true);
        setShowMainButton(false);
      } else if (eventData === 'timer start') {
        setShowMainButton(true);
      }
    };

    const handleSessionConnectEvent = event => {
      if (event?.permissionGranted === true) {
        setShowRecButtonsIos(true);
      } else if (event?.recordingComplete === 1) {
        startRecordingMethod(false);
        setShowRecButtonsIos(false);
      } else {
        startRecordingMethod(false);
      }
    };

    const androidEventListener =
      Platform.OS === 'android'
        ? addRecordingEventListener(
            'RecordingPermissionDenied',
            handleRecordingEvent,
          )
        : null;

    const iosEventListener =
      Platform.OS === 'ios'
        ? addRecordingEventListener(
            'onSessionConnect',
            handleSessionConnectEvent,
          )
        : null;

    return () => {
      if (androidEventListener) {
        androidEventListener.remove();
      }
      if (iosEventListener) {
        iosEventListener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rotateImage = toValue => {
    Animated.timing(rotation, {
      toValue,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const startRecordingNative = async config => {
    try {
      console.log('Recording start ==>', config);
      await RecordScreen.setup(config);
      await RecordScreen.startRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecordingNative = async () => {
    try {
      const result = await RecordScreen.stopRecording();
      console.log('Recording stopped. Result:', result);
      return result;
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const pauseRecordingNative = async () => {
    try {
      console.log('Recording paused');
      await RecordScreen.pauseRecording();
    } catch (error) {
      console.error('Error pausing recording:', error);
    }
  };

  const resumeRecordingNative = async () => {
    try {
      console.log('Recording resume');
      await RecordScreen.resumeRecording();
    } catch (error) {
      console.error('Error resuming recording:', error);
    }
  };

  const handleStartRecording = async () => {
    if (Platform.OS === 'ios') {
      startRecordingMethod(true);
    }
    const config = {
      width: 720,
      height: 1280,
      mic: Platform.OS === 'ios' ? true : false,
      fps: 60,
      bitrate: 1920 * 1080 * 144,
    };
    await startRecordingNative(config);
  };

  const handleMainButtonPress = () => {
    setShowButtons(!showButtons);
    startRecordingMethod(false);
  };

  const handlePlayPause = () => {
    pauseRecordingMethod(!isPaused);
    if (!isPaused) {
      pauseRecordingNative();
    } else {
      resumeRecordingNative();
    }
  };

  const handleStopPress = async () => {
    pauseRecordingMethod(false);
    startRecordingMethod(!startRecording);
    try {
      const result = await stopRecordingNative();
      console.log('stopRecordingNative ===>', result);
      setModalVisible(true)
      // setRecUri(result);
    } catch (error) {
      console.error('Error in stopRecordingNative:', error);
    }
  };

  const handleSubButtonPress = action => {
    setShowButtons(false);
    switch (action) {
      case 'Camera':
        setScreenshotCount(prevCount => prevCount + 1); 
        setShowScreenShotCount(true)
        onPressCamera();
        break;
      case 'Screen Recording':
        handleStartRecording();
        break;
      default:
        break;
    }
  };

  const handleSubmitFeedback = () => {
    setModalVisible(false)
    setScreenshotCount(0)
    setShowScreenShotCount(false)
  }

  const renderPlusButton = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.mainButton}
        onPress={handleMainButtonPress}>
        <Animated.Image
          source={icon.plus}
          style={[
            styles.iconStyle,
            {
              transform: [
                {
                  rotate: rotation.interpolate({
                    inputRange: [0, 45],
                    outputRange: ['0deg', '45deg'],
                  }),
                },
              ],
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  const renderSubButton = () => {
    return (
      <View style={styles.subButtonContainer}>
        <Animated.View
          style={[
            {
              transform: [{translateY: translateY1}],
            },
          ]}>
          <TouchableOpacity
            onPress={() => handleSubButtonPress('Camera')}
            style={styles.subButton}>
            <Image source={icon.camera} style={styles.iconStyle} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            {
              transform: [{translateY: translateY2}],
            },
          ]}>
          <TouchableOpacity
            onPress={() => handleSubButtonPress('Screen Recording')}
            style={styles.subButton}>
            <Image source={icon.video} style={styles.iconStyle} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderAndroidComponent = () => {
    return (
      <View style={styles.playPauseContainer}>
        <View style={styles.playPauseButton}>
          <Image source={icon.recording} style={styles.smallIconStyle} />
        </View>
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={handlePlayPause}>
          <Image
            source={isPaused ? icon.play : icon.pause}
            style={styles.smallIconStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={handleStopPress}>
          <Image source={icon.stop} style={styles.smallIconStyle} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderIosComponent = () => {
    return (
      <View style={styles.playPauseContainer}>
        <View style={styles.playPauseButton}>
          <Image source={icon.recording} style={styles.smallIconIosStyle} />
        </View>
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={handleStopPress}>
          <Image source={icon.stop} style={styles.smallIconStyle} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderScreenshotCount = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.screenshotCountBtn}
        onPress={()=>{setModalVisible(true)}}
        >
          <Text style={styles.countText}>{screenshotCount}</Text>
        </TouchableOpacity>
    )
  }

  const renderFeedbackPopup = () => {
    return(
      <View style={styles.centeredView}>
      <Modal
      animationType='none'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}>
      <KeyboardAvoidingView behavior= {Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.centeredView}>
        <View style={styles.modalView}>
        <Text style={{fontSize: 20, paddingBottom: 10}}>Feedback</Text>
          <TouchableOpacity 
          activeOpacity={1}
          style={styles.cancelModalBtn} onPress={() => setModalVisible(false)}>
            <Image source={icon.cancel} style={styles.cancelIconStyle} />
            </TouchableOpacity>
          <TextInput style={styles.modalTextInput} 
          placeholder='Enter your feedback'
          placeholderTextColor={'#929292'}
          multiline={true}
          />
          <TouchableOpacity
              activeOpacity={1}
              style={[styles.button, styles.buttonClose]}
              onPress={() => {handleSubmitFeedback()}}>
              <Text style={styles.textStyle}>Submit</Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    </Modal>
    </View>
    )
  }

  return (
    <View>
      {showMainButton ? (
          <AnimatedLoader primaryColor={primaryColor}/>
      ) : (
        <View>
        {modalVisible && renderFeedbackPopup()}
        {showScreenShotCount && renderScreenshotCount()}
        <View style={styles.container}>
          {Platform.OS === 'android' &&
            !startRecording &&
            !showMainButton &&
            renderPlusButton()}
          {Platform.OS === 'ios' &&
            !startRecording &&
            !showRecButtonsIos &&
            renderPlusButton()}

          {Platform.OS === 'android' &&
            !startRecording &&
            !showMainButton &&
            renderSubButton()}
          {Platform.OS === 'ios' &&
            !startRecording &&
            !showRecButtonsIos &&
            renderSubButton()}

          {Platform.OS === 'android' &&
            startRecording &&
            !showMainButton &&
            renderAndroidComponent()}
          {Platform.OS === 'ios' &&
            !startRecording &&
            showRecButtonsIos &&
            renderIosComponent()}
        </View>
        </View>
      )}
    </View>
  );
  
};

export default FloatingButton;
