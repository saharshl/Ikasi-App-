import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { auth, firebase, firestore } from "../firebase";
import { useState, useEffect } from "react";

import { RootStack, HomeStack } from "./StackNavigators";

const AuthNavigation = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  

  function onAuthStateChanged(user) {
    setUser(user);
    if (loading) setLoading(false);
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);

    return subscriber;
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    );
  }
  
    return(
      <NavigationContainer>
        <HomeStack/>
      </NavigationContainer>
    )

};

export { AuthNavigation };
