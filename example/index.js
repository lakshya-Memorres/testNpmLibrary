import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { MyProvider } from 'react-native-record-screen';

const Main = () => (
    <MyProvider>
      <App />
    </MyProvider>
  );

AppRegistry.registerComponent(appName, () => Main);
