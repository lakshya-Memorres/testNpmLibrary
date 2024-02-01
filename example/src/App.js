
import * as React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import FloatingButton from 'react-native-record-screen';
import ViewShot from 'react-native-view-shot';
import { MyProvider, useMyContext } from './context/MyContext';


export default function App() {
  const viewShot = React.useRef(null);

  return (
    <MyProvider>
      <ViewShot ref={viewShot} style={styles.container}
        options={{ result: "data-uri"}}
        >
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#90EE90'}}>
          <Text>Home Page</Text>
        </View>
      </ViewShot>
     <FloatingButton 
      useMyContext={useMyContext} 
      primaryColor = {'#FBDD24'}
      secondaryColor = {'#3F3F3F'}
      viewShotRef={viewShot}
      />
    </MyProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderWidth: 2,
      borderColor: 'white'
    },
});
