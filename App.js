import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View ,Animated } from 'react-native';
import { Button, RadioButton, TextInput } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import Register from './components/Register';
import Login from './components/Login';
import UserProfileNavigator from './components/DonarProfile';
import BloodbankProfile from './components/BloodbankProfile';
import BloodbankProfileNavigator from './components/BloodbankProfile';
import SeekerHome from './components/SeekerHome';


const Stack = createStackNavigator();
const opacity = new Animated.Value(0);

Animated.timing(opacity, {
  toValue: 1,
  duration: 500,
}).start();

export default function App() {

  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Login"  component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="DonarProfile"  component={UserProfileNavigator} options={{ headerShown: false }}  />
        <Stack.Screen name="BloodBankProfile" component={BloodbankProfileNavigator} options={{ headerShown: false }}  />
        <Stack.Screen name="SeekerHome" component={SeekerHome} options={{ headerShown: false }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

