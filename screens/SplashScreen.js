import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { auth, db } from '../firebase';

export default function SplashScreen({ navigation, info }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 75,
  },
});
