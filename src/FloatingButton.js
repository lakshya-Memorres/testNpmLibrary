import React, { useEffect, useState, useRef } from 'react';
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
  KeyboardAvoidingView,
  FlatList,
  ImageBackground,
  PanResponder
} from 'react-native';
import { icon } from './utils';
import { Platform } from 'react-native';
import AnimatedLoader from './AnimatedLoader';
import Sound from 'react-native-sound';
import { createThumbnail } from "react-native-create-thumbnail";
import { captureRef } from 'react-native-view-shot';

const { RecordScreen } = NativeModules;
const recordScreenEvents = new NativeEventEmitter(RecordScreen);

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const FloatingButton = ({
  viewShotRef,
  useMyContext,
  primaryColor,
  secondaryColor,
}) => {
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
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      zIndex: 99999,
    },
    screenshotCountBtn: {
      backgroundColor: primaryColor,
      borderRadius: 11,
      width: 22,
      height: 22,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999,
      position: 'absolute',
      bottom: 47,
      right: -5,
      borderWidth: 0.7,
      borderColor: 'white',
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
      marginBottom: 10,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
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
      fontSize: 13,
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
      tintColor: secondaryColor,
    },
    delThumbnailView: {
      tintColor: secondaryColor,
      position: 'absolute',
      height: 26,
      width: 26,
      borderRadius: 13,
      backgroundColor: primaryColor,
      justifyContent: 'center',
      alignItems: 'center',
      top: 5,
      right: 5,
    },
    playIconOverlay: {
      tintColor: secondaryColor,
      height: 26,
      width: 26,
      borderRadius: 13,
      backgroundColor: primaryColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    thumbnailContainer: {
      overflow: 'hidden',
    },
    thumbnailStyle: {
      height: 150,
      width: SCREEN_WIDTH / 3.9,
      margin: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centeredView: {
      flex: 1,
    },
    thumbnailView: {
      flex: 1,
      marginBottom: 10,
      alignSelf: 'flex-start',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      elevation: 5,
      flex: 1,
    },
    button: {
      borderRadius: 7,
      padding: 14,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      marginBottom: 10,
    },
    buttonClose: {
      backgroundColor: primaryColor,
      width: '100%',
    },
    textStyle: {
      color: secondaryColor,
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 15,
    },
    headerTextStyle: {
      color: secondaryColor,
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 20,
      paddingBottom: 10,
    },
    modalTextInput: {
      borderWidth: 1,
      width: '100%',
      height: 200,
      borderRadius: 15,
      textAlignVertical: 'top',
      paddingHorizontal: 10,
      fontSize: 16,
      borderWidth: 1,
      borderColor: 'rgba(211, 211, 211, 0.9)',
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
      right: -13,
    },
  });
  const { startRecording, startRecordingMethod, isPaused, pauseRecordingMethod } = useMyContext();
  const [showButtons, setShowButtons] = useState(false);
  const [showMainButton, setShowMainButton] = useState(false);
  const [showRecButtonsIos, setShowRecButtonsIos] = useState(false);
  const [showScreenShotCount, setShowScreenShotCount] = useState(false);
  const [screenshotCount, setScreenshotCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [rotation] = useState(new Animated.Value(0));
  const [translateY1] = useState(new Animated.Value(0));
  const [translateY2] = useState(new Animated.Value(0));
  const [translateY3] = useState(new Animated.Value(0));
  const [screenshotUrls, setScreenshotUrls] = React.useState([]);
  const [thumbnail, setThumbnail] = useState([]);
  const [mergedThumbnails, setMergedThumbnails] = useState(
    [...screenshotUrls, ...thumbnail].filter((item) => !!item)
  );

  //drag
  const pan = useRef(new Animated.ValueXY()).current;
  const [mainButtonPosition, setMainButtonPosition] = useState('bottom');
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const { dx, dy } = gesture;
        pan.x.setValue(dx);
        pan.y.setValue(dy);
      },
      onPanResponderRelease: (_, gesture) => {
        const { dx, dy, moveX, moveY} = gesture;
        pan.extractOffset();
        Animated.spring(pan, {
          toValue: { x: 2, y: 2 },
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  useEffect(() => {
    setScreenshotCount(mergedThumbnails.length);
  }, [mergedThumbnails, showButtons]);

  useEffect(() => {
    setMergedThumbnails((prevMergedThumbnails) => {
      return [...screenshotUrls, ...thumbnail].filter((item) => !!item);
    });
  }, [screenshotUrls, thumbnail, showButtons]);
 //384, 320, 448
 useEffect(() => {
  if (showButtons) {
    setShowScreenShotCount(true);
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
      Animated.timing(translateY3, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      rotateImage(45),
    ]).start();
  } else {
    setShowScreenShotCount(false);
    Animated.parallel([
      Animated.timing(translateY1, {
        toValue:  128,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(translateY2, {
        toValue:  64,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(translateY3, {
        toValue:  192,
        duration: 200,
        useNativeDriver: false,
      }),
      rotateImage(0),
    ]).start();
  }
}, [showButtons, startRecording, translateY3._value]);

// useEffect(() => {

//   if (showButtons) {
//     setShowScreenShotCount(true);
//     Animated.parallel([
//       Animated.timing(translateY1, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: false,
//       }),
//       Animated.timing(translateY2, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: false,
//       }),
//       Animated.timing(translateY3, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: false,
//       }),
//       rotateImage(mainButtonPosition === 'bottom' ? 45 : -45), // Adjust the rotation based on the main button position
//     ]).start();
//   } else {
//     setShowScreenShotCount(false);
//     Animated.parallel([
//       Animated.timing(translateY1, {
//         toValue: mainButtonPosition === 'bottom' ? 128 : -128,
//         duration: 200,
//         useNativeDriver: false,
//       }),
//       Animated.timing(translateY2, {
//         toValue: mainButtonPosition === 'bottom' ? 64 : -64,
//         duration: 200,
//         useNativeDriver: false,
//       }),
//       Animated.timing(translateY3, {
//         toValue: mainButtonPosition === 'bottom' ? 192 : -192,
//         duration: 200,
//         useNativeDriver: false,
//       }),
//       rotateImage(0),
//     ]).start();
//   }
// }, [showButtons, startRecording, translateY3._value, mainButtonPosition]);


  useEffect(() => {
    const addRecordingEventListener = (eventName, callback) => {
      return recordScreenEvents.addListener(eventName, callback);
    };

    const handleRecordingEvent = (eventData) => {
      if (eventData === 'true') {
        startRecordingMethod(false);
      } else if (eventData === 'false') {
        startRecordingMethod(true);
        setShowMainButton(false);
      } else if (eventData === 'timer start') {
        setShowMainButton(true);
      }
    };

    const handleSessionConnectEvent = (event) => {
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
            handleRecordingEvent
          )
        : null;

    const iosEventListener =
      Platform.OS === 'ios'
        ? addRecordingEventListener(
            'onSessionConnect',
            handleSessionConnectEvent
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

  const handleDeleteItem = (index) => {
    setMergedThumbnails((prevMergedThumbnails) => {
      const updatedThumbnails = [...prevMergedThumbnails];
      const deletedItem = updatedThumbnails.splice(index, 1)[0];
      if (screenshotUrls.includes(deletedItem)) {
        setScreenshotUrls((prevScreenshotUrls) =>
          prevScreenshotUrls.filter((url) => url !== deletedItem)
        );
      } else if (thumbnail.includes(deletedItem)) {
        setThumbnail((prevThumbnails) =>
          prevThumbnails.filter((thumb) => thumb !== deletedItem)
        );
      }
      return updatedThumbnails;
    });
  };

  const captureScreenshot = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: 'jpg',
        quality: 0.9,
      });
      setScreenshotUrls((prevUris) => [...prevUris, uri]);
    } catch (error) {
      console.error('Oops, snapshot failed', error);
    }
  };

  const soundFile = new Sound('screenshot.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.error('Failed to load the sound', error);
    }
  });

  const generateThumbnail = async (path) => {
    try {
      const response = await createThumbnail({
        url: Platform.OS === 'ios' ? path.result.outputURL : `file://${path}`,
        timeStamp: 1000,
        format: 'png',
      });
      if (response?.path) {
        setThumbnail((prevUris) => [...prevUris, response?.path]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const rotateImage = (toValue) => {
    Animated.timing(rotation, {
      toValue,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const startRecordingNative = async (config) => {
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
      generateThumbnail(result);
      setShowButtons(true);
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
    // setMainButtonPosition(mainButtonPosition === 'bottom' ? 'top' : 'bottom');
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
    } catch (error) {
      console.error('Error in stopRecordingNative:', error);
    }
  };

  const handleSubButtonPress = (action) => {
    switch (action) {
      case 'Camera':
        setShowScreenShotCount(true);
        captureScreenshot();
        soundFile.play();
        break;
      case 'Screen Recording':
        handleStartRecording();
        setShowButtons(false);
        break;
      default:
        break;
    }
  };

  const handleCloseFeedbackPopup = () => {
    setModalVisible(false);
    setScreenshotCount(mergedThumbnails.length);
  };

  const handleSubmitFeedback = () => {
    setModalVisible(false);
    setScreenshotCount(0);
    setShowScreenShotCount(false);
    setThumbnail([]);
    setScreenshotUrls([]);
    setMergedThumbnails([]);
    setShowButtons(false);
  };

  const renderPlusButton = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.mainButton}
        onPress={handleMainButtonPress}
      >
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
      <Animated.View
        style={[
          styles.subButtonContainer,
          // {
          //   bottom: mainButtonPosition === 'bottom' ? 54 : undefined,
          //   top: mainButtonPosition === 'top' ? 54 : undefined,
          // },
          {
            
            transform: [
              {
                // translateY : 0
                translateY: pan.y.interpolate({
                  inputRange: [0,0],
                  // outputRange: [showButtons ? 256 : 0, 0],
                  outputRange: [0, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}>
        <Animated.View
          style={[
            {
              transform: [{ translateY: translateY3 }],
            },
          ]}
        >
          {showScreenShotCount && screenshotCount !== 0 && (
            <View style={styles.screenshotCountBtn}>
              <Text style={styles.countText}>{screenshotCount}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.subButton}
          >
            <Image source={icon.feedback} style={styles.iconStyle} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            {
              transform: [{ translateY: translateY1 }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => handleSubButtonPress('Camera')}
            style={styles.subButton}
          >
            <Image source={icon.camera} style={styles.iconStyle} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            {
              transform: [{ translateY: translateY2 }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => handleSubButtonPress('Screen Recording')}
            style={styles.subButton}
          >
            <Image source={icon.video} style={styles.iconStyle} />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
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
          onPress={handlePlayPause}
        >
          <Image
            source={isPaused ? icon.play : icon.pause}
            style={styles.smallIconStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={handleStopPress}
        >
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
          onPress={handleStopPress}
        >
          <Image source={icon.stop} style={styles.smallIconStyle} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderFeedbackPopup = () => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.centeredView}
          >
            <View style={styles.modalView}>
              <Text style={styles.headerTextStyle}>Feedback</Text>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.cancelModalBtn}
                onPress={() => handleCloseFeedbackPopup()}
              >
                <Image source={icon.cancel} style={styles.cancelIconStyle} />
              </TouchableOpacity>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Enter your feedback"
                placeholderTextColor={'#929292'}
                multiline={true}
              />
              <View style={styles.thumbnailView}>
                <FlatList
                  data={mergedThumbnails}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={styles.thumbnailContainer}>
                        <ImageBackground
                          style={styles.thumbnailStyle}
                          source={{
                            uri: item,
                          }}
                        >
                          {thumbnail.includes(item) && (
                            <View style={styles.playIconOverlay}>
                              <Image
                                source={icon.play}
                                style={styles.cancelIconStyle}
                              />
                            </View>
                          )}
                        </ImageBackground>
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => handleDeleteItem(index)}
                          style={styles.delThumbnailView}
                        >
                          <Image
                            source={icon.cancel}
                            style={styles.cancelIconStyle}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  keyExtractor={(index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  numColumns={3}
                />
              </View>
              <TouchableOpacity
                activeOpacity={1}
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  handleSubmitFeedback();
                }}
              >
                <Text style={styles.textStyle}>Submit</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  };

  return (
    <View>
      {showMainButton ? (
        <AnimatedLoader primaryColor={primaryColor} />
      ) : (
        <View>
          {modalVisible && renderFeedbackPopup()}
          {/* <View style={styles.container}> */}
          <Animated.View
        style={[styles.container, {
          transform: [{translateX: pan.x.interpolate({
            inputRange: [-SCREEN_WIDTH + 86  , 0 ],
            outputRange: [-SCREEN_WIDTH + 86 , 0 ],
            extrapolate: 'clamp'
        })}, {translateY: pan.y.interpolate({
          inputRange: [-SCREEN_HEIGHT + 102 , 0 ],
          outputRange: [-SCREEN_HEIGHT + 102, 0 ],
          extrapolate: 'clamp'
      })}],
        }]}
        {...panResponder.panHandlers}>
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
          {/* </View> */}
          </Animated.View>
        </View>
      )}
    </View>
  );
};

export default FloatingButton;
