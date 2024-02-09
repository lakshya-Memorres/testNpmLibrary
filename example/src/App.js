
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
        </View>
      </ViewShot>
     <FloatingButton 
      useMyContext={useMyContext} 
      primaryColor = {'#00B5B4'}
      secondaryColor = {'#FFFFFF'}
      viewShotRef={viewShot}
      recipientsEmailId={['recipient1@example.com', 'recipient2@example.com']}
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
    backgroundColor: '#eedd82'
  }
});
