
# react-native-record-screen

A React Native package for capturing screenshots and recording screen interactions with feedback functionalities.





## Installation

To use this package locally, add the following line to your package.json dependencies:

```bash
"react-native-record-screen": "https://github.com/lakshya-Memorres/testNpmLibrary"
```

Ensure you have the required libraries installed:

```bash
npm i react-native-create-thumbnail
npm i react-native-sound
npm i react-native-view-shot
npm i react-native-fast-image
npm i react-native-mail
```
On iOS, run:
```bash
cd ios && pod install
```
Additionally, make sure to include the required permissions in your AndroidManifest.xml:
```bash
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

And in your Info.plist for iOS:
```bash
<key>NSCameraUsageDescription</key>
<string>Please allow use of camera</string>
<key>NSMicrophoneUsageDescription</key>
<string>Please allow use of microphone</string>
```

For sound capture, you'll need to add audio files to your project:
- **Android**: Save your sound clip files under the directory **`android/app/src/main/res/raw`**.
- **iOS**: Add your sound files to the project in Xcode.

## Usage/Examples

Wrap your main component with `MyProvider` in the index.js file:

```javascript
import { name as appName } from './app.json';
import { MyProvider } from 'react-native-record-screen';

const Main = () => (
    <MyProvider>
      <App />
    </MyProvider>
);
AppRegistry.registerComponent(appName, () => Main);
```

In your App.js:

```javascript
import { FloatingButton, MyProvider, useMyContext } from 'react-native-record-screen';
import ViewShot from 'react-native-view-shot';

export default function App() {
  const viewShot = React.useRef(null);

  return (
    <MyProvider>
      <ViewShot ref={viewShot} style={styles.container} options={{ result: "data-uri"}}>
        <RootNavigator/>
      </ViewShot>
     <FloatingButton 
      useMyContext={useMyContext} 
      primaryColor={'#FBDD24'}
      secondaryColor={'#3F3F3F'}
      viewShotRef={viewShot}
      />
    </MyProvider>
  );
}
```



## Props


Feel free to customize the primary and secondary colors according to your app theme.
- **`useMyContext`**: A hook to use the context values provided by the package.
- **`primaryColor`**: The primary color for the FloatingButton component.
- **`secondaryColor`**: The secondary color for the FloatingButton component.
- **`viewShotRef`**: A ref to the react-native-view-shot component for capturing screenshots.

