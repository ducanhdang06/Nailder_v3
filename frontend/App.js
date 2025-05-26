import 'react-native-get-random-values';
import './src/aws/setup';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import SwipeScreen from './src/screens/SwipeScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
