/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from './src/HomeScreen';
import {SecondScreen} from './src/SecondScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Second">
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Second" component={SecondScreen} />
        </Tab.Navigator>
        {/* <Stack.Navigator>
          <Stack.Screen name = "Home" component = {HomeScreen} />
          <Stack.Screen name = "Second" component = {SecondScreen} />
        </Stack.Navigator> */}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
