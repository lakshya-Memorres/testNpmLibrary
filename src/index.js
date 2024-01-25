// import { NativeModules, Platform } from 'react-native';

// const LINKING_ERROR =
//   `The package 'react-native-record-screen' doesn't seem to be linked. Make sure: \n\n` +
//   Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
//   '- You rebuilt the app after installing the package\n' +
//   '- You are not using Expo Go\n';

// const RecordScreen = NativeModules.RecordScreen
//   ? NativeModules.RecordScreen
//   : new Proxy(
//       {},
//       {
//         get() {
//           throw new Error(LINKING_ERROR);
//         },
//       }
//     );

// export function startRecording() {
//   return RecordScreen.startRecording()
// }


import FloatingButton from './FloatingButton';
module.exports = FloatingButton;