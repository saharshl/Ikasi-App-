import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ExtraText, ExtraView, TextLink, TextLinkContent, B } from '../components/styles';
import { auth } from '../firebase';
import { Button, Input } from 'react-native-elements';

export default CustomInput = ({ value, placeholder = '', customStyle, onChangeText = () => {}, secureTextEntry = false, keyboardType = 'default', maxLength = 1000 }) => {
  return (
    <Input
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      inputContainerStyle={[styles.input, customStyle]}
      placeholder={placeholder}
      containerStyle={{ width: '100%', height: 50, marginBottom: 20 }}
      keyboardType={keyboardType}
      returnKeyType='done'
      maxLength={maxLength}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderBottomWidth: 0,
    borderRadius: 5,
    height: '100%',
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 10,
  },
});
