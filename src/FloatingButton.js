import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Easing,
  NativeEventEmitter,
  NativeModules,
  Dimensions,
  Text,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  ImageBackground,
  PanResponder,
  Image,
  Alert,
} from 'react-native';
import { Platform } from 'react-native';
import AnimatedLoader from './AnimatedLoader';
import Sound from 'react-native-sound';
import { createThumbnail } from 'react-native-create-thumbnail';
import { captureRef } from 'react-native-view-shot';
import FastImage from 'react-native-fast-image';
import createStyles from './styles';
import Mailer from 'react-native-mail';

const { RecordScreen } = NativeModules;
const recordScreenEvents = new NativeEventEmitter(RecordScreen);

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const FloatingButton = React.memo(
  ({ viewShotRef, useMyContext, primaryColor, secondaryColor }) => {
    const styles = useMemo(
      () => createStyles(primaryColor, secondaryColor),
      [primaryColor, secondaryColor]
    );

    const optimizedImages = useMemo(() => {
      return {
        plus: require('../src/Icons/plusIcon.png'),
        camera: require('../src/Icons/camera.png'),
        video: require('../src/Icons/video.png'),
        play: require('../src/Icons/play.png'),
        pause: require('../src/Icons/pause.png'),
        stop: require('../src/Icons/stop.png'),
        cancel: require('../src/Icons/cancel.png'),
        recording: require('../src/Icons/rec1.gif'),
        feedback: require('../src/Icons/feedback.png'),
      };
    }, []);

    const {
      startRecording,
      startRecordingMethod,
      isPaused,
      pauseRecordingMethod,
    } = useMyContext();
    const pan = useRef(new Animated.ValueXY()).current;
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
    const [textFeedback, setTextFeedback] = useState('')
    const [mergedThumbnails, setMergedThumbnails] = useState(
      [...screenshotUrls, ...thumbnail].filter((item) => !!item)
    );

    useEffect(() => {
      setScreenshotCount(mergedThumbnails.length);
    }, [mergedThumbnails, showButtons]);

    useEffect(() => {
      setMergedThumbnails((prevMergedThumbnails) => {
        return [...screenshotUrls, ...thumbnail].filter((item) => !!item);
      });
    }, [screenshotUrls, thumbnail, showButtons]);

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
            toValue: 128,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(translateY2, {
            toValue: 64,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(translateY3, {
            toValue: 192,
            duration: 200,
            useNativeDriver: false,
          }),
          rotateImage(0),
        ]).start();
      }
    }, [showButtons, startRecording, translateY3._value]);

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

    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
          const { dx, dy } = gesture;
          pan.x.setValue(dx);
          pan.y.setValue(dy);
        },
        onPanResponderRelease: (_, gesture) => {
          const { dx, dy, moveX, moveY } = gesture;
          pan.extractOffset();
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        },
      })
    ).current;

    const sendEmail = () => {
      const emailSubject = 'Feedback Submission';
      const emailBody = `
        Feedback: ${textFeedback}
      `;
      const attachments = mergedThumbnails.map((thumbnail, index) => ({
        path: thumbnail,
        type: 'png', 
        name: `screenshot_${index + 1}.png`, 
      }));
    
      Mailer.mail({
        subject: emailSubject,
        recipients: ['sumit@memorres.com'], 
        body: emailBody,
        isHTML: false,
        attachment: attachments,
      }, (error, event) => {
        if (error) {
          console.error('Failed to send email:', error);
        } else {
          console.log('Email sent successfully');
        }
      });
    };
    

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

    const soundFile = new Sound(
      'screenshot.mp3',
      Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.error('Failed to load the sound', error);
        }
      }
    );

    const generateThumbnail = async (path) => {
      try {
        const response = await createThumbnail({
          url: Platform.OS === 'ios' ? path.result.outputURL : `file://${path}`,
          timeStamp: Platform.OS === 'ios' ? 0 : 1000,
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

      if (mergedThumbnails.length === 0 && !textFeedback) {
        Alert.alert('Cannot submit empty feedback');
        return;
      }

      setModalVisible(false);
      setScreenshotCount(0);
      setShowScreenShotCount(false);
      setThumbnail([]);
      setScreenshotUrls([]);
      setMergedThumbnails([]);
      setShowButtons(false);

      sendEmail();
    };

    const renderPlusButton = () => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.mainButton}
          onPress={handleMainButtonPress}
        >
          <Animated.Image
            source={optimizedImages.plus}
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
            {
              transform: [
                {
                  translateY: pan.y.interpolate({
                    inputRange: [0, 0],
                    outputRange: [0, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
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
              <FastImage
                tintColor={secondaryColor}
                source={optimizedImages.feedback}
                style={styles.iconStyle}
              />
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
              <FastImage
                tintColor={secondaryColor}
                source={optimizedImages.camera}
                style={styles.iconStyle}
              />
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
              <FastImage
                tintColor={secondaryColor}
                source={optimizedImages.video}
                style={styles.iconStyle}
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      );
    };

    const renderAndroidComponent = () => {
      return (
        <View style={styles.playPauseContainer}>
          <View style={styles.playPauseButton}>
            <FastImage
              tintColor={secondaryColor}
              source={
                isPaused ? optimizedImages.video : optimizedImages.recording
              }
              style={styles.smallIconStyle}
            />
          </View>
          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={handlePlayPause}
          >
            <FastImage
              tintColor={secondaryColor}
              source={isPaused ? optimizedImages.play : optimizedImages.pause}
              style={styles.smallIconStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={handleStopPress}
          >
            <FastImage
              tintColor={secondaryColor}
              source={optimizedImages.stop}
              style={styles.smallIconStyle}
            />
          </TouchableOpacity>
        </View>
      );
    };

    const renderIosComponent = () => {
      return (
        <View style={styles.playPauseContainer}>
          <View style={styles.playPauseButton}>
            <FastImage
              tintColor={secondaryColor}
              source={optimizedImages.recording}
              style={styles.smallIconIosStyle}
            />
          </View>
          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={handleStopPress}
          >
            <FastImage
              tintColor={secondaryColor}
              source={optimizedImages.stop}
              style={styles.smallIconStyle}
            />
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
                  <FastImage
                    tintColor={secondaryColor}
                    source={optimizedImages.cancel}
                    style={styles.cancelIconStyle}
                  />
                </TouchableOpacity>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Enter your feedback"
                  placeholderTextColor={'#929292'}
                  multiline={true}
                  value={textFeedback}
                  onChangeText={setTextFeedback}
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
                                <FastImage
                                  tintColor={secondaryColor}
                                  source={optimizedImages.play}
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
                            <FastImage
                              tintColor={secondaryColor}
                              source={optimizedImages.cancel}
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
            <Animated.View
              style={[
                styles.container,
                {
                  transform: [
                    {
                      translateX: pan.x.interpolate({
                        inputRange: [-SCREEN_WIDTH + 86, 0],
                        outputRange: [-SCREEN_WIDTH + 86, 0],
                        extrapolate: 'clamp',
                      }),
                    },
                    {
                      translateY: pan.y.interpolate({
                        inputRange: [-SCREEN_HEIGHT + 102, 0],
                        outputRange: [-SCREEN_HEIGHT + 102, 0],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
              ]}
              {...panResponder.panHandlers}
            >
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
            </Animated.View>
          </View>
        )}
      </View>
    );
  }
);

export default FloatingButton;
