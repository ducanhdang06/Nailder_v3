import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ConfirmSignUpScreen from '../screens/auth/ConfirmSignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import TechnicianLayout from '../screens/TechnicianLayout';
import CustomerLayout from '../screens/CustomerLayout';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="CustomerHome" component={CustomerLayout} options={{ headerShown: false }} />
        <Stack.Screen name="TechnicianHome" component={TechnicianLayout} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
