import { Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const createStyles = (primaryColor, secondaryColor) => {
  return {
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
      // position: 'absolute',
      bottom: 10,
      right: 0,
      backgroundColor: primaryColor,
      borderRadius: 27,
      // zIndex: 9999999999
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
    shareButton: {
      borderRadius: 7,
      padding: 14,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      marginBottom: 10,
      backgroundColor: primaryColor,
      width: '47%',
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
      marginBottom: 15,
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
    animatedLoaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      top: -SCREEN_HEIGHT,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      zIndex: 999,
    },
    innerLoaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
    },
    loader: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 10,
      borderTopColor: primaryColor,
      borderRightColor: primaryColor,
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
      fontWeight: 'bold',
      color: secondaryColor
    },
    loadingText: {
      fontSize: 16,
      color: secondaryColor
    }
  };
};

export default createStyles;
