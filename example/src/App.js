import moment from 'moment';
import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import FloatingButton from 'react-native-record-screen';
import ViewShot from 'react-native-view-shot';
import { MyProvider, useMyContext } from './context/MyContext';

export default function App() {
  const { screenshotUri, screenshotMethod } = useMyContext();
  const viewShot = React.useRef(null);

  const captureScreenshot = async () => {
    try {
      const uri = await viewShot.current.capture();
      console.log('Screenshot captured:', uri);
      screenshotMethod(uri);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };

  return (
    <MyProvider>
      <ViewShot ref={viewShot} style={styles.container}>
        {/* <View style={{flex:1}}>
          <Text>Home Page</Text>
        </View> */}
      </ViewShot>
      <FloatingButton useMyContext={useMyContext} onPressCamera={captureScreenshot} />
    </MyProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
