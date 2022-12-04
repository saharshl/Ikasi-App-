import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Colors } from '../components/styles';

// screens
import Login from '../screens/Login';
import Register from '../screens/Register';
import Preregister from '../screens/Preregister';
import RegisterTutor from '../screens/RegisterTutor';
import StudentHome from '../screens/StudentHome';
import ChatList from '../screens/ChatList';
import Profile from '../screens/Profile';
import { Icon } from 'react-native-elements';
import ViewProfile from '../screens/ViewProfile';
import ChatView from '../screens/ChatView';
import Setting from '../components/Setting';
import { auth, db } from '../firebase';
import SplashScreen from '../screens/SplashScreen';
import TutorHome from '../screens/TutorHome';
import AddNewCourse from '../screens/AddNewCourse';
import EditProfile from '../screens/EditProfile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Route = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser != null);

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(() => {
      setIsLoggedIn(auth.currentUser != null);
    });
    return subscriber;
  }, []);

  return (
    <Stack.Navigator initialRouteName={'Login'} screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name='Auth' component={AuthStack} />
      ) : (
        <>
          <Stack.Screen name='Main' component={MainStack} />
          <Stack.Screen name='ChatView' component={ChatView} options={{ headerShown: true, headerTitle: '' }} />
        </>
      )}
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName={'Login'} screenOptions={screenOptionStyle}>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Preregister' component={Preregister} />
      <Stack.Screen name='Register' component={Register} />
      <Stack.Screen name='RegisterTutor' component={RegisterTutor} />
    </Stack.Navigator>
  );
};

const MainStack = ({ navigation }) => {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={{ headerShown: false }}
      tabBarOptions={{
        keyboardHidesTabBar: true,
      }}
    >
      <Tab.Screen
        name='Home'
        component={HomeStack}
        options={{
          tabBarIcon: ({ color }) => <Icon name='home' type='ionicon' size={25} color={color} />,
          title: () => null,
        }}
      />
      <Tab.Screen
        name='Chat'
        component={ChatStack}
        options={{
          tabBarIcon: ({ color }) => <Icon name='md-chatbox-ellipses' type='ionicon' size={25} color={color} />,
          title: () => null,
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color }) => <Icon name='person' type='ionicon' size={25} color={color} />,
          title: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

const HomeStack = ({ navigation }) => {
  const [userType, setUserType] = useState();

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(() => {
      db.ref(`users/${auth.currentUser.uid}`).on('value', (sp) => {
        const data = sp.val() ? sp.val() : {};
        setUserType(data.type);
      });
    });
    return subscriber;
  }, []);

  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      {userType ? (
        <>
          {userType == 'Student' && <Stack.Screen name='StudentHome' component={StudentHome} options={{ headerShown: false }} />}
          {userType == 'Tutor' && <Stack.Screen name='TutorHome' component={TutorHome} options={{ headerShown: false }} />}
          <Stack.Screen name='AddNewCourse' component={AddNewCourse} />

          <Stack.Screen name='ViewProfile' component={ViewProfile} />
        </>
      ) : (
        <Stack.Screen name='Splash' component={SplashScreen} />
      )}
    </Stack.Navigator>
  );
};

const ChatStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name='ChatList' component={ChatList} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerTransparent: true, headerTitle: '' }}>
      <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name='EditProfile' component={EditProfile} />
    </Stack.Navigator>
  );
};

const screenOptionStyle = {
  headerTintColor: Colors.tertiary,
  headerShadowVisible: false,
  headerShown: true,
  headerTitle: '',
  headerLeftContainerStyle: {
    paddingLeft: 20,
  },
};

export default Route;
