import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Colors } from '../components/styles';

// screens
import Login from '../screens/Login';
import Home from '../screens/Home';
import Register from '../screens/Register';
import Preregister from '../screens/Preregister';
import RegisterTutor from '../screens/RegisterTutor';


const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName={'Login'} screenOptions={screenOptionStyle}>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Preregister' component={Preregister}/>
      <Stack.Screen name='Register' component={Register} />
      <Stack.Screen name='RegisterTutor' component={RegisterTutor} />
    </Stack.Navigator>
  );
};

// Add all screens that should be within the app, eg categories, game etc
const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName={'Home'} screenOptions={screenOptionStyle}>
      <Stack.Screen name='Home' component={Home} />
    </Stack.Navigator>
  );
};


export { RootStack, HomeStack };

const screenOptionStyle = {
  headerTintColor: Colors.tertiary,
  headerShadowVisible: false,
  headerShown: false,
  headerTitle: '',
  headerLeftContainerStyle: {
    paddingLeft: 20,
  },
};
