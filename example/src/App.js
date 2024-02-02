
import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FloatingButton, MyProvider, useMyContext } from 'react-native-record-screen';
import ViewShot from 'react-native-view-shot';


export default function App() {
  const viewShot = React.useRef(null);

  return (
    <MyProvider>
      <ViewShot ref={viewShot} style={styles.container}
        options={{ result: "data-uri"}}
        >
        <View style={styles.mainView}>
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
  mainView: {
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#90EE90'
  }
});
